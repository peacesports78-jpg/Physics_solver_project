



# ==================================================================================================================================================   deepsek-chat%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
import os
import json
import base64
import time
import requests
from flask import Flask, request, jsonify, send_file, render_template_string
from flask_cors import CORS
from PIL import Image, ImageDraw
import io
import cv2 
import numpy as np

# ⚠️ КОНСТАНТЫ КАЛИБРОВКИ ⚠️
Y_PIXEL_OFFSET = 35 
ZOOM_ADJUSTMENT_FACTOR = 1.03 

# --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
try:
    import pytesseract
    OCR_AVAILABLE = True
    pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
except ImportError:
    OCR_AVAILABLE = False
    print("⚠️ ОШИБКА: pytesseract не установлен.")

# --- КОНСТАНТЫ API ---
TEMP_CROPPED_FILE = 'temp_cropped.jpg'
TEMP_FULL_FILE = 'temp_full.jpg'     
TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' 

# ⚠️ ВАШ API КЛЮЧ (новый ключ, который вы получили)
DEEPSEEK_API_KEY = "sk-b9eff464cd4e42449e90b86d429d30a6" 
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# ⚠️ УЛУЧШЕННЫЙ ПРОМТ ДЛЯ DEEPSEEK ⚠️
PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи, распознанный через OCR (могут быть ошибки).

ТВОИ ЗАДАЧИ:
1. Исправь ошибки OCR (только опечатки, не меняй смысл задачи)
2. Реши задачу по физике, которая полностью видна в тексте
3. Игнорируй номера страниц, задания и другие посторонние элементы
4. Верни ответ СТРОГО в JSON формате:

{
    "solutions": [
        {
            "title": "Название метода решения",
            "formulas": ["формула 1", "формула 2", "формула 3"],
            "answer": "окончательный ответ с единицами измерения",
            "steps": ["шаг 1 - описание", "шаг 2 - описание", "шаг 3 - описание"]
        }
    ]
}

КРИТИЧЕСКИ ВАЖНО ДЛЯ JSON:
- МАКСИМУМ 12 шагов в steps (не больше!)
- Каждый шаг в steps должен быть КОРОТКИМ (максимум 2-3 предложения)
- НЕ пиши в steps свои рассуждения, догадки или проверки - только четкие действия
- НЕ используй кавычки внутри текста steps - заменяй их на одинарные или убирай
- НЕ используй переносы строк внутри одного шага
- НЕ обрывай шаги на середине - каждый шаг должен быть полным
- answer должен точно соответствовать финальному результату из последнего шага steps
- Все кавычки в JSON должны быть двойными "
- Если шагов больше 12 - остановись и верни только первые 12

ВАЖНЫЕ МАТЕМАТИЧЕСКИЕ ПРАВИЛА:
- Выполняй все расчеты точно, не округляй промежуточные значения
- В окончательном ответе округляй до 3 значащих цифр
- Если ответ получается ~269, НЕ округляй до 300!
- Если число получилось 269.34, пиши "269" или "269.3"
- Используй разумное округление: 269.8 → 270, 269.2 → 269
- Всегда указывай единицы измерения
- Проверяй расчеты дважды перед ответом
- answer должен быть равен финальному результату из последнего шага steps

ПРИМЕР ПРАВИЛЬНОГО ФОРМАТА:
{
    "solutions": [{
        "title": "Закон сохранения энергии",
        "formulas": ["E = (k*x^2)/2", "E = mgh + A"],
        "answer": "110 Н/м",
        "steps": [
            "Шаг 1 - Записать закон сохранения энергии: E_пружины + mgh = A",
            "Шаг 2 - Подставить значения: (k*0.02^2)/2 + 0.005*9.8*2 = 0.12",
            "Шаг 3 - Вычислить: 0.0002k + 0.098 = 0.12",
            "Шаг 4 - Решить: k = 0.022/0.0002 = 110 Н/м"
        ]
    }]
}
"""

app = Flask(__name__)
# Настройка CORS для работы с мобильным приложением
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"]
    }
})

last_debug_data = {}
last_ocr_text = ""
last_ai_response = ""

def debug_print(message):
    timestamp = time.strftime("%H:%M:%S")
    print(f"[{timestamp}] {message}")

def extract_text_from_image(image_path):
    if not OCR_AVAILABLE:
        return None, "OCR недоступен"
    try:
        img = cv2.imread(image_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        pil_image = Image.fromarray(processed)
        text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
        return text.strip(), None
    except Exception as e:
        return None, str(e)

def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
    global last_debug_data
    try:
        image = Image.open(io.BytesIO(image_bytes))
        
        raw_w, raw_h = image.size
        rotated = False
        
        if screen_h > screen_w and raw_w > raw_h:
            image = image.transpose(Image.ROTATE_270)
            rotated = True
            debug_print("🔄 Фото повернуто на 90 градусов.")

        img_w, img_h = image.size
        image.save(TEMP_FULL_FILE)

        screen_aspect = screen_w / screen_h
        img_aspect = img_w / img_h
        
        scale = 1.0
        offset_x_centering = 0
        offset_y_centering = 0
        
        if screen_aspect < img_aspect:
            scale = img_h / screen_h
            scale *= ZOOM_ADJUSTMENT_FACTOR
            visible_width_on_image = screen_w * scale
            diff = img_w - visible_width_on_image
            offset_x_centering = diff / 2
        else:
            scale = img_w / screen_w
            scale *= ZOOM_ADJUSTMENT_FACTOR
            visible_height_on_image = screen_h * scale
            diff = img_h - visible_height_on_image
            offset_y_centering = diff / 2

        frame_y_corrected = frame_rect['y'] - Y_PIXEL_OFFSET
        frame_y_corrected = max(0, frame_y_corrected)

        left = int((frame_rect['x'] * scale) + offset_x_centering)
        top = int((frame_y_corrected * scale) + offset_y_centering)
        width = int(frame_rect['width'] * scale)
        height = int(frame_rect['height'] * scale)
        right = left + width
        bottom = top + height
        
        last_debug_data = {
            "screen": f"{screen_w}x{screen_h}",
            "image": f"{img_w}x{img_h}",
            "rotated": rotated,
            "y_offset_used": Y_PIXEL_OFFSET,
            "zoom_logic": {
                "base_scale": round(img_h / screen_h if screen_aspect < img_aspect else img_w / screen_w, 3),
                "adj_factor": ZOOM_ADJUSTMENT_FACTOR,
                "final_scale_factor": round(scale, 3),
                "hidden_margin_x": int(offset_x_centering),
                "hidden_margin_y": int(offset_y_centering)
            },
            "frame_input": frame_rect,
            "crop_coords": {"l": left, "t": top, "r": right, "b": bottom}
        }
        
        left = max(0, left); top = max(0, top)
        right = min(img_w, right); bottom = min(img_h, bottom)
        crop_box = (left, top, right, bottom)
        
        cropped = image.crop(crop_box)
        cropped.save(TEMP_CROPPED_FILE)
        
        debug_img = image.copy()
        draw = ImageDraw.Draw(debug_img)
        draw.rectangle(crop_box, outline="red", width=10) 
        debug_img.save(TEMP_DEBUG_FILE)
        
        return TEMP_CROPPED_FILE
        
    except Exception as e:
        debug_print(f"Ошибка обрезки: {e}")
        return None

def call_deepseek(text):
    """
    Отправляет текст задачи в DeepSeek API и получает структурированный ответ.
    """
    try:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
        }
        
        payload = {
            "model": "deepseek-reasoner",  # DeepSeek R1 - модель для reasoning
            "messages": [
                {"role": "system", "content": PROMPT_SYSTEM},
                {"role": "user", "content": f"Распознанный текст задачи:\n\n{text}\n\nВерни решение в указанном JSON формате. ВАЖНО: максимум 12 шагов в steps, каждый шаг короткий (2-3 предложения).\n\nКРИТИЧЕСКИ ВАЖНО: После рассуждений ОБЯЗАТЕЛЬНО верни JSON в поле 'content'. JSON должен быть в финальном ответе 'content', а не только в reasoning. Структура JSON:\n{{\"solutions\": [{{\"title\": \"...\", \"formulas\": [...], \"answer\": \"...\", \"steps\": [...]}}]}}\n\nЕСЛИ ТЫ НЕ ВЕРНЕШЬ JSON В CONTENT - ЗАДАЧА НЕ БУДЕТ РЕШЕНА. JSON ОБЯЗАТЕЛЕН В CONTENT."}
            ],
            "temperature": 0.1,
            "max_tokens": 6000,  # Увеличено для R1, чтобы JSON точно поместился
            "stream": False  # Отключаем streaming для простоты
        }
        
        debug_print(f"📡 Отправляем запрос в DeepSeek API...")
        
        # Увеличиваем таймаут для R1 - она может работать дольше
        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=120)
        
        if response.status_code != 200:
            error_msg = f"Ошибка API: {response.status_code} - {response.text}"
            debug_print(f"❌ {error_msg}")
            return None, error_msg
        
        result = response.json()
        
        # Проверяем структуру ответа
        if "choices" not in result or len(result["choices"]) == 0:
            error_msg = "DeepSeek вернул пустой ответ (нет choices)"
            debug_print(f"❌ {error_msg}")
            debug_print(f"📄 Полный ответ API:")
            try:
                debug_print(json.dumps(result, indent=2, ensure_ascii=False)[:2000])
            except:
                debug_print(str(result)[:2000])
            return None, error_msg
        
        message = result["choices"][0]["message"]
        
        # DeepSeek R1 может возвращать ответ в reasoning_content или content
        # Сначала проверяем content, если пустой - берем reasoning_content
        ai_response = message.get("content", "")
        reasoning_content = message.get("reasoning_content", "")
        
        # Логируем что получили
        debug_print(f"📊 content длина: {len(ai_response)}, reasoning_content длина: {len(reasoning_content)}")
        if ai_response:
            debug_print(f"📝 content (первые 200 символов): {ai_response[:200]}")
        
        # Если content пустой или содержит только пробелы/переносы, проверяем reasoning_content
        if not ai_response or len(ai_response.strip()) < 10:  # Минимум 10 символов для валидного JSON
            if reasoning_content and len(reasoning_content.strip()) > 0:
                debug_print("⚠️ content пустой, ищем JSON в reasoning_content от DeepSeek R1")
                debug_print(f"📝 reasoning_content содержит {len(reasoning_content)} символов")
                
                # Ищем JSON в reasoning_content (может быть в конце рассуждений)
                # Пробуем найти валидный JSON блок
                json_found = False
                
                # Стратегия 1: Ищем ВСЕ блоки { ... } и проверяем их на валидность
                # Ищем как с конца, так и с начала
                all_json_blocks = []
                
                # Поиск с конца (более вероятно, что JSON в конце)
                pos = len(reasoning_content) - 1
                
                while pos >= 0:
                    # Ищем закрывающую скобку
                    if reasoning_content[pos] == '}':
                        # Ищем соответствующую открывающую скобку
                        bracket_count = 1
                        json_end = pos
                        json_start = -1
                        
                        for i in range(pos - 1, -1, -1):
                            if reasoning_content[i] == '}':
                                bracket_count += 1
                            elif reasoning_content[i] == '{':
                                bracket_count -= 1
                                if bracket_count == 0:
                                    json_start = i
                                    break
                        
                        if json_start != -1:
                            potential_json = reasoning_content[json_start:json_end+1]
                            # Проверяем, что это похоже на наш JSON (содержит "solutions" или "answer")
                            if ('"solutions"' in potential_json or "'solutions'" in potential_json or 
                                '"answer"' in potential_json or "'answer'" in potential_json):
                                all_json_blocks.append((json_start, json_end, potential_json))
                                # Пропускаем этот блок и продолжаем поиск
                                pos = json_start - 1
                                continue
                    
                    pos -= 1
                
                # Берем самый большой JSON блок (вероятно, это наш ответ)
                if all_json_blocks:
                    # Сортируем по размеру (от большего к меньшему)
                    all_json_blocks.sort(key=lambda x: x[1] - x[0], reverse=True)
                    best_json = all_json_blocks[0][2]
                    debug_print(f"📋 Найден JSON блок в reasoning_content (длина: {len(best_json)}, всего блоков: {len(all_json_blocks)})")
                    ai_response = best_json
                    json_found = True
                
                # Стратегия 2: Если не нашли, ищем по ключевым словам
                if not json_found:
                    keywords = ['"solutions"', "'solutions'", '"answer"', "'answer'", 'JSON', 'json', 'решение', 'ответ']
                    for keyword in keywords:
                        keyword_pos = reasoning_content.find(keyword)
                        if keyword_pos != -1:
                            # Ищем { перед и после ключевого слова
                            search_start = max(0, keyword_pos - 1000)
                            search_end = min(len(reasoning_content), keyword_pos + 2000)
                            
                            # Ищем все { в этой области
                            for json_start in range(search_start, search_end):
                                if reasoning_content[json_start] == '{':
                                    bracket_count = 0
                                    json_end = -1
                                    for i in range(json_start, min(len(reasoning_content), json_start + 10000)):
                                        if reasoning_content[i] == '{':
                                            bracket_count += 1
                                        elif reasoning_content[i] == '}':
                                            bracket_count -= 1
                                            if bracket_count == 0:
                                                json_end = i
                                                break
                                    
                                    if json_end != -1:
                                        potential_json = reasoning_content[json_start:json_end+1]
                                        if keyword in potential_json:
                                            debug_print(f"📋 Найден JSON по ключевому слову '{keyword}' (длина: {len(potential_json)})")
                                            ai_response = potential_json
                                            json_found = True
                                            break
                            
                            if json_found:
                                break
                
                if not json_found:
                    # Если JSON не найден, логируем последние 2000 символов для диагностики
                    debug_print("⚠️ JSON не найден в reasoning_content")
                    debug_print(f"📝 Последние 2000 символов reasoning_content:")
                    debug_print(reasoning_content[-2000:])
                    debug_print(f"📝 Первые 500 символов reasoning_content:")
                    debug_print(reasoning_content[:500])
                    # Используем весь reasoning_content - возможно, JSON будет найден позже
                    ai_response = reasoning_content
            else:
                error_msg = "DeepSeek вернул пустой ответ (и content, и reasoning_content пустые)"
                debug_print(f"❌ {error_msg}")
                debug_print(f"📄 Структура ответа:")
                try:
                    debug_print(json.dumps(result, indent=2, ensure_ascii=False)[:2000])
                except:
                    debug_print(str(result)[:2000])
                return None, error_msg
        
        debug_print(f"✅ Получен ответ от DeepSeek")
        debug_print("=" * 80)
        debug_print("🤖 ОТВЕТ ОТ DEEPSEEK R1:")
        debug_print("-" * 80)
        debug_print(ai_response[:2000])  # Первые 2000 символов
        if len(ai_response) > 2000:
            debug_print(f"... (еще {len(ai_response) - 2000} символов)")
        debug_print("=" * 80)
        
        # Очищаем JSON от лишнего
        json_str = ai_response
        
        # Убираем Markdown
        if "```json" in json_str:
            json_str = json_str.split("```json")[1].split("```")[0].strip()
        elif "```" in json_str:
            json_str = json_str.split("```")[1].split("```")[0].strip()
        
        # Ищем JSON объект
        start_idx = json_str.find('{')
        end_idx = json_str.rfind('}')
        
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            json_str = json_str[start_idx:end_idx+1]
        
        # Улучшенная очистка JSON
        # 1. Убираем переносы строк внутри строковых значений (но сохраняем структуру)
        def fix_newlines_in_strings(text):
            result = []
            in_string = False
            escape_next = False
            for i, char in enumerate(text):
                if escape_next:
                    result.append(char)
                    escape_next = False
                    continue
                if char == '\\':
                    escape_next = True
                    result.append(char)
                    continue
                if char == '"' and not escape_next:
                    in_string = not in_string
                    result.append(char)
                    continue
                if in_string and char in ['\n', '\r']:
                    result.append(' ')  # Заменяем перенос на пробел
                else:
                    result.append(char)
            return ''.join(result)
        
        json_str = fix_newlines_in_strings(json_str)
        
        # 2. Исправляем обрезанные строки - если строка не закрыта кавычкой, закрываем её
        # Считаем кавычки и если их нечетное количество в конце - значит строка обрезана
        quote_count = json_str.count('"')
        if quote_count % 2 != 0:
            # Находим последнюю незакрытую строку и закрываем её
            last_quote_idx = json_str.rfind('"')
            if last_quote_idx != -1:
                # Ищем, где должна заканчиваться строка (до следующей запятой или закрывающей скобки)
                remaining = json_str[last_quote_idx+1:]
                # Если после последней кавычки нет закрывающей кавычки до конца - добавляем
                if '"' not in remaining[:50]:  # Проверяем ближайшие 50 символов
                    # Находим конец строки (запятая, закрывающая скобка или конец)
                    end_pos = len(json_str)
                    for end_char in [',', ']', '}']:
                        pos = remaining.find(end_char)
                        if pos != -1 and pos < end_pos:
                            end_pos = last_quote_idx + 1 + pos
                    # Закрываем строку перед концом
                    if end_pos < len(json_str):
                        json_str = json_str[:end_pos] + '"' + json_str[end_pos:]
                    else:
                        json_str = json_str + '"'
        
        # 2. Заменяем одинарные кавычки на двойные (но не внутри уже существующих строк)
        # Это делаем аккуратно, чтобы не сломать структуру
        
        if json_str and len(json_str) > 0:
            debug_print(f"📝 Очищенный JSON (первые 500 символов):\n{json_str[:500]}...")
        else:
            debug_print("❌ JSON строка пустая после очистки!")
        
        try:
            parsed_json = json.loads(json_str)
            
            # Проверяем структуру
            if "solutions" not in parsed_json:
                debug_print("⚠️ В ответе нет ключа 'solutions'")
                parsed_json = {
                    "solutions": [{
                        "title": "Решение задачи",
                        "formulas": ["Формулы не предоставлены"],
                        "answer": "Ответ не сформирован",
                        "steps": ["Попробуйте сфотографировать еще раз"]
                    }]
                }
            
            # Исправляем поле formulas если нужно
            for solution in parsed_json["solutions"]:
                if "formulas" not in solution:
                    solution["formulas"] = ["Формулы не указаны"]
                if "title" not in solution:
                    solution["title"] = "Решение"
                if "answer" not in solution:
                    solution["answer"] = "Ответ не указан"
                if "steps" not in solution:
                    solution["steps"] = ["Шаги решения не предоставлены"]
                
                # Очищаем steps от слишком длинных текстов и переносов строк
                if "steps" in solution and isinstance(solution["steps"], list):
                    cleaned_steps = []
                    # Ограничиваем количество шагов до 12
                    steps_to_process = solution["steps"][:12]
                    
                    for step in steps_to_process:
                        if isinstance(step, str):
                            # Убираем переносы строк
                            step = step.replace('\n', ' ').replace('\r', ' ')
                            # Убираем множественные пробелы
                            step = ' '.join(step.split())
                            
                            # Проверяем, не обрезан ли шаг (если заканчивается на незавершенном слове или символе)
                            # Удаляем шаги, которые выглядят обрезанными
                            if step.endswith('-') and len(step) < 20:
                                # Слишком короткий обрезанный шаг - пропускаем
                                continue
                            
                            # Ограничиваем длину шага (максимум 400 символов)
                            if len(step) > 400:
                                step = step[:397] + "..."
                            
                            # Пропускаем пустые шаги
                            if step.strip():
                                cleaned_steps.append(step)
                        else:
                            cleaned_steps.append(str(step))
                    
                    # Если после очистки шагов не осталось, добавляем заглушку
                    if not cleaned_steps:
                        cleaned_steps = ["Шаги решения не удалось обработать"]
                    
                    solution["steps"] = cleaned_steps
            
            debug_print(f"✅ Успешно распарсен JSON")
            debug_print(f"📊 Решений: {len(parsed_json['solutions'])}")
            
            return json.dumps(parsed_json, ensure_ascii=False), None
            
        except json.JSONDecodeError as e:
            debug_print(f"❌ Ошибка парсинга JSON: {e}")
            debug_print(f"📄 Проблемный JSON (первые 1000 символов):\n{json_str[:1000]}")
            
            # Проверяем, может быть JSON был обрезан
            if json_str.count('{') > json_str.count('}'):
                debug_print("⚠️ JSON обрезан - не хватает закрывающих скобок")
            if '"solutions"' not in json_str and "'solutions'" not in json_str:
                debug_print("⚠️ JSON не содержит ключ 'solutions'")
            
            # Фолбэк ответ с более информативным сообщением
            fallback_json = {
                "solutions": [{
                    "title": "Ошибка обработки ответа AI",
                    "formulas": ["DeepSeek R1 не вернул валидный JSON"],
                    "answer": "Попробуйте еще раз",
                    "steps": [
                        "1. Сфотографируйте задачу четко и полностью",
                        "2. Убедитесь в стабильном интернете",
                        "3. Подождите немного и попробуйте снова"
                    ]
                }]
            }
            return json.dumps(fallback_json, ensure_ascii=False), None
            
    except requests.exceptions.Timeout:
        error_msg = "Таймаут запроса к DeepSeek API"
        debug_print(f"❌ {error_msg}")
        return None, error_msg
    except Exception as e:
        error_msg = f"Ошибка при вызове DeepSeek: {str(e)}"
        debug_print(f"❌ {error_msg}")
        return None, error_msg

@app.route('/solve', methods=['POST', 'OPTIONS'])
def solve():
    """Основной эндпоинт для решения задач"""
    if request.method == 'OPTIONS':
        # Обработка preflight запроса для CORS
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        return response
    
    try:
        debug_print("📡 Получен запрос /solve")
        if not request.json:
            return jsonify({"success": False, "message": "Нет данных в запросе"}), 400
        
        data = request.json
        img_bytes = base64.b64decode(data['image'])
        
        # 1. Обрезка изображения
        cropped_path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
        if not cropped_path: 
            return jsonify({"success": False, "message": "Ошибка обрезки изображения"}), 500
        
        # 2. Base64 для клиента
        with open(cropped_path, "rb") as image_file:
            cropped_base64 = base64.b64encode(image_file.read()).decode('utf-8')
            
        # 3. Распознавание текста
        ocr_text, ocr_error = extract_text_from_image(cropped_path)
        
        if ocr_error:
            debug_print(f"⚠️ Ошибка OCR: {ocr_error}")
            return jsonify({
                "success": False, 
                "message": f"Ошибка OCR: {ocr_error}",
                "cropped_image_base64": cropped_base64
            }), 500
        
        if not ocr_text or len(ocr_text.strip()) < 10:
            debug_print("⚠️ OCR вернул слишком короткий текст")
            return jsonify({
                "success": False,
                "message": "Не удалось распознать текст задачи",
                "cropped_image_base64": cropped_base64
            }), 500
        
        debug_print(f"✅ OCR распознал текст ({len(ocr_text)} символов)")
        debug_print("=" * 80)
        debug_print("📝 РАСПОЗНАННЫЙ ТЕКСТ ЗАДАЧИ:")
        debug_print("-" * 80)
        debug_print(ocr_text)
        debug_print("=" * 80)
        
        # 4. Вызов DeepSeek
        debug_print("🚀 Отправляем в DeepSeek...")
        ai_response_json, ai_error = call_deepseek(ocr_text)
        
        if ai_error:
            return jsonify({
                "success": False,
                "message": f"Ошибка AI: {ai_error}",
                "cropped_image_base64": cropped_base64
            }), 500
        
        # 5. Парсим ответ
        try:
            solutions_data = json.loads(ai_response_json)
            
            if "solutions" not in solutions_data:
                solutions_data = {
                    "solutions": [{
                        "title": "Структурная ошибка",
                        "formulas": ["Неверный формат ответа"],
                        "answer": "Попробуйте еще раз",
                        "steps": ["Перефотографируйте задачу"]
                    }]
                }
            
            debug_print(f"✅ Готово! Решений: {len(solutions_data['solutions'])}")
            
            return jsonify({
                "success": True, 
                "cropped_image_base64": cropped_base64,
                "solutions": solutions_data["solutions"]
            })
            
        except json.JSONDecodeError as e:
            debug_print(f"❌ Ошибка парсинга: {e}")
            return jsonify({
                "success": False,
                "message": f"Ошибка обработки: {str(e)}",
                "cropped_image_base64": cropped_base64
            }), 500
        
    except Exception as e:
        debug_print(f"❌ Ошибка в solve(): {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "message": f"Ошибка: {str(e)}"}), 500

# --- DASHBOARD ---
@app.route('/dashboard')
def dashboard():
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Physics Solver Dashboard</title>
        <style>
            body { font-family: monospace; background: #1e1e1e; color: #ddd; padding: 20px; }
            .container { display: flex; flex-direction: row; gap: 20px; flex-wrap: wrap; }
            .box { background: #2d2d2d; padding: 15px; border-radius: 8px; border: 1px solid #444; }
            img { max-width: 450px; border: 2px solid #555; }
            pre { color: #8f8; overflow-x: auto; white-space: pre-wrap; }
            h2 { margin-top: 0; color: #fff; border-bottom: 1px solid #555; padding-bottom: 5px; }
            .status { padding: 10px; border-radius: 5px; margin: 5px 0; }
            .ok { background: #2d5a2d; }
            .warning { background: #5a5a2d; }
            .error { background: #5a2d2d; }
        </style>
    </head>
    <body>
        <h1>📸 Physics Solver Dashboard</h1>
        
        <div class="box">
            <h2>⚙️ Статус системы</h2>
            <div class="status {ocr_class}">
                <strong>OCR:</strong> {ocr_status}
            </div>
            <div class="status {api_class}">
                <strong>DeepSeek API:</strong> {api_status}
            </div>
        </div>

        <div class="container">
            <div class="box">
                <h2>📷 Полное изображение</h2>
                <img src="/debug/full_rect?t={time}" />
            </div>
            
            <div class="box">
                <h2>✂️ Обрезанное изображение</h2>
                <img src="/debug/cropped?t={time}" />
            </div>
        </div>

        <div class="box">
            <h2>📊 Данные обрезки</h2>
            <pre>{debug_data}</pre>
        </div>
    </body>
    </html>
    """
    
    ocr_status = "Доступен" if OCR_AVAILABLE else "Не доступен"
    ocr_class = "ok" if OCR_AVAILABLE else "error"
    
    api_status = "Ключ установлен" if DEEPSEEK_API_KEY and DEEPSEEK_API_KEY != "sk-..." else "Требуется ключ"
    api_class = "ok" if DEEPSEEK_API_KEY and DEEPSEEK_API_KEY != "sk-..." else "warning"
    
    return render_template_string(
        html, 
        ocr_status=ocr_status,
        ocr_class=ocr_class,
        api_status=api_status,
        api_class=api_class,
        time=time.time(),
        debug_data=json.dumps(last_debug_data, indent=2, ensure_ascii=False)
    )

@app.route('/debug/full_rect')
def get_debug_rect():
    if os.path.exists(TEMP_DEBUG_FILE): 
        return send_file(TEMP_DEBUG_FILE)
    return "No image"

@app.route('/debug/cropped')
def get_debug_crop():
    if os.path.exists(TEMP_CROPPED_FILE): 
        return send_file(TEMP_CROPPED_FILE)
    return "No image"

@app.route('/status', methods=['GET', 'OPTIONS'])
def status():
    """Эндпоинт для проверки статуса сервера"""
    if request.method == 'OPTIONS':
        # Обработка preflight запроса для CORS
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        return response
    
    try:
        debug_print("📡 Получен запрос /status")
        return jsonify({
            "success": True, 
            "api_key_valid": bool(DEEPSEEK_API_KEY and DEEPSEEK_API_KEY != "sk-..."),
            "ocr_available": OCR_AVAILABLE,
            "server_time": time.strftime("%H:%M:%S"),
            "model": "deepseek-reasoner",
            "server_ip": request.remote_addr
        })
    except Exception as e:
        debug_print(f"❌ Ошибка в /status: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    debug_print(f"🚀 Запуск Physics Solver Server...")
    debug_print(f"📊 OCR: {'✅ Доступен' if OCR_AVAILABLE else '❌ Не доступен'}")
    debug_print(f"🔑 DeepSeek API: {'✅ Ключ установлен' if DEEPSEEK_API_KEY and DEEPSEEK_API_KEY != 'sk-...' else '⚠️ Требуется ключ'}")
    debug_print(f"🌐 Dashboard: http://localhost:5000/dashboard")
    debug_print(f"📡 API эндпоинт: http://0.0.0.0:5000/solve")
    
    app.run(host='0.0.0.0', port=5000, debug=True)



# # %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
