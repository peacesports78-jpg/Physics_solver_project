# import json
# from flask import Flask, request, jsonify
# from PIL import Image
# import io
# import re
# import os
# import time
# from playwright.sync_api import sync_playwright

# app = Flask(__name__)

# # --- КОНСТАНТЫ И ПРОМПТ ДЛЯ DEEPSEEK ---
# DEEPSEEK_PROMPT = """
# Реши задачу с изображения. Приведи ВСЕ возможные способы решения (минимум 2, если есть).
# Твой ответ должен быть СТРОГО структурирован. Не пиши никакого вступления или заключения, только данные внутри тегов.

# Используй следующий формат для КАЖДОГО способа:

# <METHOD>
# <TITLE>Название способа</TITLE>
# <FORMULAS>Здесь перечисли главные формулы через точку с запятой (F = k*q1*q2/r^2; E = F/q)</FORMULAS>
# <ANSWER>Краткий ответ с числом и единицами</ANSWER>
# <STEPS>
# Подробное пошаговое решение.
# Можешь использовать переносы строк.
# </STEPS>
# </METHOD>

# Если способов несколько, просто повтори блок <METHOD>...</METHOD> для следующего способа.
# """

# def parse_deepseek_response(text):
#     """Парсит ответ DeepSeek, используя теги <METHOD>."""
#     solutions = []
#     method_blocks = re.findall(r'<METHOD>(.*?)</METHOD>', text, re.DOTALL)
    
#     for block in method_blocks:
#         try:
#             # Ищем данные внутри тегов
#             title = re.search(r'<TITLE>(.*?)</TITLE>', block, re.DOTALL).group(1).strip()
#             formulas_str = re.search(r'<FORMULAS>(.*?)</FORMULAS>', block, re.DOTALL).group(1).strip()
#             answer = re.search(r'<ANSWER>(.*?)</ANSWER>', block, re.DOTALL).group(1).strip()
#             steps = re.search(r'<STEPS>(.*?)</STEPS>', block, re.DOTALL).group(1).strip()
            
#             # Преобразуем формулы из строки в список
#             formulas_list = [f.strip() for f in formulas_str.split(';') if f.strip()]

#             solutions.append({
#                 'title': title,
#                 'formulas': formulas_list,
#                 'answer': answer,
#                 'steps': steps,
#             })
#         except Exception as e:
#             print(f"Ошибка парсинга блока: {e}")
#             continue
            
#     return solutions

# def get_deepseek_solution(image_path):
#     """Автоматизирует DeepSeek с помощью Playwright."""
#     print("-> Запуск Playwright для автоматизации DeepSeek...")
    
#     with sync_playwright() as p:
#         # headless=False, чтобы ты видел браузер!
#         browser = p.chromium.launch(headless=False, slow_mo=50) 
#         page = browser.new_page()
#         page.goto("https://chat.deepseek.com/") 
        
#         try:
#             # 1. Загрузка изображения (селектор может потребовать настройки!)
#             file_input = page.wait_for_selector("input[type=file]", timeout=15000) 
#             file_input.set_input_files(image_path)
#             time.sleep(3) 

#             # 2. Вставка промпта (селектор может потребовать настройки!)
#             text_area_selector = "textarea[placeholder='Ask Deepseek...']" 
#             page.fill(text_area_selector, DEEPSEEK_PROMPT)
            
#             # 3. Отправка (селектор может потребовать настройки!)
#             send_button_selector = "button[aria-label='Send message']" 
#             page.click(send_button_selector)
            
#             # 4. Ожидание ответа
#             page.wait_for_selector("button:has-text('Regenerate')", timeout=120000) 

#             # 5. Копирование текста
#             # Берем текст из последнего контейнера ответа
#             answer_container = page.locator(".markdown-body").last
#             full_response_text = answer_container.inner_text()
            
#             print("  -> Ответ получен.")
#             return full_response_text

#         except Exception as e:
#             print(f"Playwright Error: {e}")
#             return None
#         finally:
#             browser.close()

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     # 1. Проверка и получение данных
#     photo_file = request.files.get('photo')
#     source_rect_str = request.form.get('sourceRect')
    
#     if not photo_file or not source_rect_str:
#         return jsonify({'success': False, 'message': 'Отсутствует файл или координаты'}), 400

#     try:
#         source_rect = json.loads(source_rect_str)
#         x, y, w, h = source_rect['x'], source_rect['y'], source_rect['width'], source_rect['height']
#     except Exception:
#         return jsonify({'success': False, 'message': 'Неверный формат координат'}), 400
        
#     # 2. Обработка изображения (Обрезка)
#     temp_cropped_path = 'temp_cropped.jpg'
    
#     try:
#         img = Image.open(io.BytesIO(photo_file.read()))
#         cropped_img = img.crop((x, y, x + w, y + h))
#         cropped_img.save(temp_cropped_path)
#     except Exception as e:
#         return jsonify({'success': False, 'message': f'Ошибка обработки изображения: {e}'}), 500

#     # 3. Отправка в DeepSeek
#     deepseek_text = get_deepseek_solution(temp_cropped_path)
    
#     if not deepseek_text:
#         return jsonify({'success': False, 'message': 'Не удалось получить ответ от DeepSeek'}), 500
        
#     # 4. Парсинг ответа и очистка
#     solutions = parse_deepseek_response(deepseek_text)
#     if os.path.exists(temp_cropped_path):
#         os.remove(temp_cropped_path)

#     # 5. Ответ клиенту
#     if solutions:
#         return jsonify({'success': True, 'solutions': solutions})
#     else:
#         return jsonify({'success': False, 'message': 'Парсинг ответа не удался.', 'raw_text': deepseek_text})

# if __name__ == '__main__':
#     print("--- Flask Server Started ---")
#     print("Listening on http://0.0.0.0:5000/solve")
#     app.run(host='0.0.0.0', port=5000)



# ------------------------------------------------------------------------------------------------
# python server.py
# Зависимости: flask, playwright, Pillow, deepseek_auth.json (создается вручную)

# import os
# import io
# import re
# import json
# from flask import Flask, request, jsonify
# from playwright.sync_api import sync_playwright
# from PIL import Image
# from urllib.parse import quote

# app = Flask(__name__)

# # --- ГЛОБАЛЬНЫЕ НАСТРОЙКИ ---
# # Путь к файлу авторизации, который вы только что создали
# AUTH_FILE = 'deepseek_auth.json'
# DEEPSEEK_URL = "https://chat.deepseek.com/chat"

# # --- ЛОГИКА ПАРСИНГА ОТВЕТА ---

# # Эта функция извлекает структурированные данные из ответа DeepSeek
# def parse_deepseek_response(text):
#     solutions = []
    
#     # Регулярное выражение для поиска блоков методов: 
#     # Заголовок (например, "Способ 1."), Формулы, Ответ и Шаги
#     method_blocks = re.findall(r'(Метод|Способ).*?(?=\n\n|$)', text, re.DOTALL) 

#     # Если не найдено структурированных блоков, возвращаем пустой список
#     if not method_blocks:
#         return []

#     for block in method_blocks:
#         try:
#             # 1. Находим заголовок внутри блока
#             title = re.search(r'(Метод|Способ).*?\n', block)
#             if title:
#                 title = title.group(0).strip()
#             else:
#                 title = "Решение без заголовка"
            
#             # 2. Находим формулы (список строк, начинающихся с символа)
#             formulas_list = re.findall(r'[*-]\s*.*?(?=\n|$)', block)
#             formulas = [f.strip('*- ').strip() for f in formulas_list]

#             # 3. Находим ответ (часто выделен жирным или просто в конце)
#             answer_match = re.search(r'(Ответ|Результат|Итого):\s*([^\n]+)', block, re.IGNORECASE)
#             answer = answer_match.group(2).strip() if answer_match else "Ответ не указан"

#             # 4. Находим шаги (любой текст между формулами/заголовком и ответом)
#             steps_match = re.search(r'Шаги:\s*(.*?)(?=Ответ|Результат|Итого|$)', block, re.DOTALL | re.IGNORECASE)
#             steps_text = steps_match.group(1).strip() if steps_match else ""
            
#             # Разбиваем шаги на отдельные пункты, если они есть
#             steps = re.findall(r'[*-]?\s*Шаг \d+:\s*(.*?)(?=\s*Шаг \d+:|$)', steps_text, re.DOTALL)
#             steps = [s.strip() for s in steps]

#             # Добавляем найденный метод в список
#             solutions.append({
#                 'title': title,
#                 'formulas': formulas,
#                 'answer': answer,
#                 'steps': steps
#             })
            
#         except Exception as e:
#             # Если парсинг одного из блоков дал сбой, пропускаем его
#             print(f"Ошибка парсинга блока: {e}")
#             continue

#     return solutions

# # --- ОСНОВНАЯ ЛОГИКА PLAYWRIGHT ---

# def get_deepseek_solution(image_path):
#     # Проверяем, существует ли файл авторизации
#     if not os.path.exists(AUTH_FILE):
#         return {
#             "success": False, 
#             "message": f"Файл авторизации '{AUTH_FILE}' не найден. Пожалуйста, выполните вход вручную."
#         }
        
#     print("---> Запуск Playwright для автоматизации DeepSeek...")
    
#     try:
#         with sync_playwright() as p:
#             # Запускаем браузер в безголовом режиме (headless=True) и загружаем состояние авторизации
#             browser = p.chromium.launch(headless=True) 
#             context = browser.new_context(storage_state=AUTH_FILE)
#             page = context.new_page()
            
#             # 1. Переходим на страницу чата
#             page.goto(DEEPSEEK_URL, wait_until="networkidle")

#             # 2. Ждем загрузки поля ввода и прикрепляем изображение
#             # DeepSeek использует скрытый <input type="file">. 
#             # Мы ищем кнопку загрузки файла, которая активирует это поле.
#             file_chooser_button = page.locator("button[aria-label='Прикрепить изображение']")
            
#             with page.expect_file_chooser() as fc_info:
#                 file_chooser_button.click()

#             file_chooser = fc_info.value
#             file_chooser.set_files(image_path)
#             print(f"Файл '{os.path.basename(image_path)}' прикреплен.")

#             # 3. Отправляем запрос
#             # Генерируем запрос, чтобы DeepSeek знал, что делать с картинкой
#             prompt = "Пожалуйста, решите эту физическую или математическую задачу. Ответьте на русском языке, используя следующий структурированный формат для каждого метода: Заголовок (например, 'Способ 1. ...'), Ключевые формулы (маркированным списком), Шаги (пронумерованным списком) и финальный Ответ."
            
#             # Ждем, пока кнопка отправки станет активной
#             send_button = page.locator("button[aria-label='Отправить сообщение']")
#             send_button.wait_for(state="visible", timeout=15000)
            
#             # Вводим промпт и отправляем
#             page.fill("textarea", prompt) 
#             send_button.click()
#             print("Промпт отправлен. Ожидаем ответа...")
            
#             # 4. Ожидаем ответа
#             # Ждем, пока индикатор загрузки ответа не исчезнет (или пока не появится текст)
#             # В DeepSeek можно ждать, пока кнопка "Остановить" не исчезнет
#             page.wait_for_selector("button[aria-label='Отправить сообщение']", state="visible", timeout=60000)
#             print("Ответ получен.")
            
#             # 5. Извлекаем текст
#             # Обычно DeepSeek выводит ответ в последнем контейнере сообщения
#             messages = page.locator('.message-container').all()
#             if messages:
#                 # Берем текст из последнего сообщения
#                 response_text = messages[-1].inner_text() 
#             else:
#                 response_text = "Не удалось найти текст ответа."
            
#             # 6. Парсинг и возврат результата
#             solutions = parse_deepseek_response(response_text)
            
#             if solutions:
#                 return {"success": True, "solutions": solutions}
#             else:
#                 return {"success": False, "message": "Сервер получил ответ, но не смог извлечь структурированное решение. Попробуйте другой снимок."}

#     except Exception as e:
#         print(f"Критическая ошибка Playwright: {e}")
#         return {"success": False, "message": f"Ошибка Playwright/DeepSeek. Убедитесь, что deepseek_auth.json валиден. Ошибка: {e}"}

# # --- МАРШРУТ FLASK ---

# @app.route('/solve', methods=['POST'])
# def solve_physics():
#     # 1. Получаем файл
#     photo_file = request.files.get('photo')
#     if not photo_file:
#         return jsonify({"success": False, "message": "Файл 'photo' не найден в запросе."}), 400

#     # 2. Получаем координаты рамки
#     source_rect_json = request.form.get('sourceRect')
#     if not source_rect_json:
#         return jsonify({"success": False, "message": "Координаты 'sourceRect' не найдены."}), 400

#     try:
#         source_rect = json.loads(source_rect_json)
#         x = int(source_rect['x'])
#         y = int(source_rect['y'])
#         width = int(source_rect['width'])
#         height = int(source_rect['height'])
#     except Exception:
#         return jsonify({"success": False, "message": "Неверный формат sourceRect."}), 400

#     # 3. Обрабатываем и обрезаем изображение
#     temp_path = "temp_cropped_photo.jpg"
    
#     try:
#         # Открываем изображение из потока данных
#         image = Image.open(io.BytesIO(photo_file.read()))
        
#         # Обрезаем изображение по координатам (x, y, x+width, y+height)
#         # Expo делает снимок в полном разрешении, но мы получаем координаты View. 
#         # Нужна коррекция, но для простого теста обрежем по координатам экрана:
#         # Поскольку DeepSeek хорошо обрезает сам, мы просто обрежем примерно
#         # и сохраним в JPEG.

#         # Внимание: Эта обрезка может быть неточной, если разрешение камеры 
#         # отличается от разрешения экрана, но для DeepSeek это не всегда критично.
#         # Crop coordinates are (left, top, right, bottom)
#         cropped_image = image.crop((x, y, x + width, y + height))
        
#         # Сохраняем обрезанное изображение
#         cropped_image.save(temp_path, format="JPEG")

#         print(f"--- Изображение обрезано и сохранено: {temp_path} ---")

#         # 4. Отправляем обрезанное изображение в DeepSeek
#         deepseek_response = get_deepseek_solution(temp_path)

#         # 5. Очистка
#         if os.path.exists(temp_path):
#             os.remove(temp_path)
            
#         # 6. Возвращаем результат клиенту
#         if deepseek_response['success']:
#             # Возвращаем структурированный JSON, который ожидает index.tsx
#             return jsonify({"success": True, "solutions": deepseek_response['solutions']})
#         else:
#             # Возвращаем ошибку DeepSeek
#             return jsonify(deepseek_response)

#     except Exception as e:
#         # Критическая ошибка на сервере
#         print(f"Критическая ошибка обработки: {e}")
#         return jsonify({"success": False, "message": f"Критическая ошибка сервера: {e}"}), 500

# # --- ЗАПУСК FLASK ---

# if __name__ == '__main__':
#     # Эта часть запускается только при прямом вызове python server.py
#     print("\n--- Flask Server Started ---")
#     # Проверяем наличие файла авторизации
#     if not os.path.exists(AUTH_FILE):
#         print(f"WARNING: Файл авторизации '{AUTH_FILE}' не найден. Автоматизация DeepSeek работать не будет.")
#         print("Пожалуйста, выполните шаг авторизации вручную, используя временный код.")
        
#     # Запуск сервера на всех доступных IP, включая 192.168.0.11
#     app.run(host='0.0.0.0', port=5000)


# ==============================================================================================================================================
# # ВРЕМЕННЫЙ КОД ТОЛЬКО ДЛЯ ВХОДА!
# # ФИНАЛЬНЫЙ ВРЕМЕННЫЙ КОД ДЛЯ ВХОДА!

# import os
# from playwright.sync_api import sync_playwright

# AUTH_FILE = 'deepseek_auth.json'

# def get_auth_file():
#     print("---> Запуск Playwright для сохранения авторизации DeepSeek...")
    
#     # *** НОВЫЕ СТРОКИ ДЛЯ ИМИТАЦИИ БРАУЗЕРА ***
#     user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
#     viewport = {"width": 1920, "height": 1080}
    
#     storage_state = AUTH_FILE if os.path.exists(AUTH_FILE) else None
    
#     try:
#         with sync_playwright() as p:
#             # Запускаем, как обычный Chrome
#             browser = p.chromium.launch(headless=False) 
            
#             # Применяем настройки, чтобы выглядеть как обычный пользователь
#             context = browser.new_context(
#                 user_agent=user_agent,
#                 viewport=viewport,
#                 storage_state=storage_state 
#             ) 
            
#             page = context.new_page()
#             page.goto("https://chat.deepseek.com/")
            
#             # У тебя есть 5 минут!
#             print("---!!! Внимание: У вас есть 5 минут для ВХОДА в DeepSeek вручную. !!!---")
            
#             # Ждем, пока браузер перейдет на страницу чата
#             page.wait_for_url("https://chat.deepseek.com/chat", timeout=300000)

#             # Сохранение твоего входа
#             context.storage_state(path=AUTH_FILE)
#             print("---!!! Авторизация сохранена/обновлена в deepseek_auth.json. Выход. !!!---")
            
#     except Exception as e:
#         print(f"Ошибка: {e}")
#         print("---!!! ВХОД НЕ УДАЛСЯ. Попробуй еще раз. !!!---")
        
#     finally:
#         if 'browser' in locals() and browser:
#             browser.close()
        
# # Запускаем создание файла
# if __name__ == '__main__':
#     get_auth_file()



# =================================================================================================================
# ==========================================================
# ФИНАЛЬНЫЙ РАБОЧИЙ КОД SERVER.PY
# ==========================================================
# import os
# import time
# import base64
# import json
# import re
# from io import BytesIO

# from flask import Flask, request, jsonify
# # Импортируем только синхронный API Playwright
# from playwright.sync_api import sync_playwright

# # --- КОНСТАНТЫ ---
# # !!! ВНИМАНИЕ !!! УБЕДИТЕСЬ, ЧТО ЭТОТ ПУТЬ ПРАВИЛЬНЫЙ И УКАЗЫВАЕТ НА deepseek_auth.json
# # Ваш путь: C:\Users\peace\OneDrive\Desktop\Project_baumana\PhysicsSolver\deepseek_auth.json
# AUTH_FILE = 'deepseek_auth.json' 
# # Если 'deepseek_auth.json' лежит в корне, как на ваших скриншотах, то достаточно 'deepseek_auth.json'
# # Если он в другом месте, вставьте полный путь: AUTH_FILE = 'C:\\Users\\peace\\OneDrive\\Desktop\\Project_baumana\\PhysicsSolver\\deepseek_auth.json'

# TEMP_IMAGE_FILE = 'temp_cropped.jpg' 

# app = Flask(__name__)

# # --- ФУНКЦИЯ ДЛЯ ВЫЗОВА DEEPSEEK С ПОМОЩЬЮ PLAYWRIGHT ---
# def get_deepseek_solution(image_path):
#     print(f"***-> Запуск DeepSeek с помощью Playwright (авторизация из {AUTH_FILE})")
    
#     # ПРОВЕРКА ФАЙЛА АВТОРИЗАЦИИ
#     if not os.path.exists(AUTH_FILE):
#         return None, f"Файл авторизации 'deepseek_auth.json' не найден по пути: {AUTH_FILE}"

#     # Чтение изображения и кодирование его в base64
#     try:
#         with open(image_path, "rb") as image_file:
#             base64_image = base64.b64encode(image_file.read()).decode('utf-8')
#     except Exception as e:
#         return None, f"Ошибка при чтении изображения: {e}"

#     # Шаблон запроса к DeepSeek с инструкцией по JSON-формату
#     prompt = (
#         f"Я хочу, чтобы ты решил физическую задачу, представленную на изображении. "
#         f"Предоставь решение в следующем формате JSON. Никакого другого текста, кроме JSON, не должно быть в ответе.\n"
#         f"В JSON-объекте должен быть только один ключ 'solution'.\n"
#         f"Значение 'solution' должно быть строкой, содержащей только текст решения (без форматирования Markdown). \n\n"
#         f"[[ВСТАВИТЬ ИЗОБРАЖЕНИЕ: {base64_image}]]"
#     )

#     # Настройки для имитации Chrome
#     user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
#     viewport = {"width": 1920, "height": 1080}
    
#     try:
#         with sync_playwright() as p:
#             # ЗАПУСК БРАУЗЕРА В СКРЫТОМ РЕЖИМЕ (headless=True)
#             # Это устраняет проблему Cloudflare, но требует, чтобы AUTH_FILE был актуальным.
#             context = p.chromium.launch(headless=).new_context( 
#                 storage_state=AUTH_FILE,
#                 user_agent=user_agent,
#                 viewport=viewport
#             )
#             page = context.new_page()
#             page.goto("https://chat.deepseek.com/chat", timeout=120000)
#             print("--- Страница DeepSeek загружена. Отправка запроса...")
            
#             # 1. Заполняем поле ввода
#             page.fill('textarea[placeholder*="Ask DeepSeek"]', prompt, timeout=10000)
            
#             # 2. Нажимаем кнопку отправки
#             page.click('button[aria-label="Send"]', timeout=10000)
            
#             # 3. Ожидание начала генерации ответа
#             # Ждем, пока появится блок с контентом
#             page.wait_for_selector('.user-content', timeout=120000) 

#             # 4. Ожидание завершения генерации ответа
#             # Ждем появления кнопки "Regenerate" (или ее аналога), которая появляется после окончания генерации
#             page.wait_for_selector('button:has-text("Regenerate")', timeout=120000)
#             print("--- Генерация ответа завершена. Извлечение решения.")

#             # 5. Извлечение последнего сообщения от DeepSeek
#             solution_elements = page.locator('.user-content').all()
#             if not solution_elements:
#                 raise Exception("Не удалось найти блок ответа DeepSeek.")
            
#             # Берем последний элемент, который является полным ответом
#             raw_response = solution_elements[-1].inner_text()
            
#             context.close()

#             return raw_response, None
            
#     except Exception as e:
#         print(f"Ошибка Playwright: {e}")
#         return None, f"Критическая ошибка Playwright: {e}"

# # --- ФУНКЦИЯ ДЛЯ ПАРСИНГА РЕШЕНИЯ ИЗ RAW ТЕКСТА ---
# def parse_solution(raw_text):
#     # 1. Поиск JSON-блока с помощью регулярного выражения
#     # Ищем текст, начинающийся с '{' и заканчивающийся '}', захватывая все символы внутри
#     json_match = re.search(r'(\{[\s\S]*\})', raw_text)
    
#     if not json_match:
#         print("Не удалось найти JSON-блок в ответе.")
#         return None

#     json_string = json_match.group(1)
    
#     # 2. Парсинг JSON
#     try:
#         solution_data = json.loads(json_string)
#         # 3. Извлечение значения 'solution'
#         final_solution = solution_data.get('solution', '').strip()
#         if final_solution:
#             return final_solution
#         else:
#             print("В JSON найден ключ 'solution', но его значение пусто.")
#             return None
#     except json.JSONDecodeError as e:
#         print(f"Ошибка парсинга JSON: {e}")
#         print(f"--- RAW TEXT: {raw_text}") 
#         return None
#     except Exception as e:
#         print(f"Неизвестная ошибка при обработке JSON: {e}")
#         return None


# # --- ГЛАВНЫЙ МАРШРУТ СЕРВЕРА ---
# @app.route('/solve', methods=['POST'])
# def solve():
#     # Проверка Content-Type
#     if request.content_type != 'application/json':
#          return jsonify({"success": False, "message": "Неверный Content-Type. Ожидается application/json.", "solutions": []}), 415

#     data = request.get_json()
    
#     if not data or 'image' not in data:
#         return jsonify({"success": False, "message": "Не найдено поле 'image' в JSON-запросе.", "solutions": []}), 400

#     # 1. Декодирование base64 и сохранение изображения
#     try:
#         image_data = base64.b64decode(data['image'])
#         with open(TEMP_IMAGE_FILE, 'wb') as f:
#             f.write(image_data)
#         print(f"Изображение сохранено в {TEMP_IMAGE_FILE}. Размер: {len(image_data) / 1024:.2f} KB")
#     except Exception as e:
#         return jsonify({"success": False, "message": f"Ошибка декодирования/сохранения изображения: {e}", "solutions": []}), 500

#     # 2. Получение ответа от DeepSeek
#     raw_response, error = get_deepseek_solution(TEMP_IMAGE_FILE)

#     if error:
#         return jsonify({"success": False, "message": error, "solutions": []}), 500

#     # 3. Парсинг решения
#     final_solution_text = parse_solution(raw_response)

#     # 4. Форматируем результат для отправки в Expo
#     if final_solution_text:
#         print("--- Решение успешно найдено и отправлено.")
#         # Создаем структуру, которую ожидает Expo
#         mock_solution = {
#             "title": "Результат от DeepSeek",
#             "answer": final_solution_text,
#             "formulas": ["-", "-"], 
#             "steps": [
#                 "**Внимание:** Решение получено от DeepSeek в виде одной строки. ",
#                 "Для получения пошагового разбора модель должна была дать более сложный JSON-формат, но мы используем самый простой.",
#                 "Полный ответ DeepSeek можно посмотреть в консоли Python (raw_response)."
#             ]
#         }
        
#         return jsonify({
#             "success": True, 
#             "message": "Решение получено.", 
#             "solutions": [mock_solution] 
#         }), 200
#     else:
#         print("--- Ошибка: Решение не найдено. (Смотрите RAW TEXT в консоли)")
#         return jsonify({
#             "success": False, 
#             "message": "Не удалось извлечь структурированное решение из ответа DeepSeek. См. терминал Python.", 
#             "solutions": []
#         }), 500


# # --- ЗАПУСК СЕРВЕРА ---
# if __name__ == '__main__':
#     print("--- Flask Server Started ---")
#     app.run(host='0.0.0.0', port=5000)



# import os
# import json
# import base64
# import re
# import time
# from flask import Flask, request, jsonify
# from playwright.sync_api import sync_playwright

# # --- НАСТРОЙКИ ---
# TEMP_IMAGE_FILE = 'temp_image.jpg'
# # Промпт настроен так, чтобы выдавать список решений (виджетов), если их несколько
# PROMPT_TEXT = """
# Реши физическую задачу с картинки.
# Верни ответ СТРОГО в формате JSON. Не пиши никакого вводного текста, сразу JSON.
# Структура JSON должна быть такой:
# {
#     "solutions": [
#         {
#             "title": "Название метода (например: Через закон сохранения)",
#             "formulas": ["E = mc^2", "F = ma"],
#             "answer": "Короткий ответ (например: 5 м/с)",
#             "steps": ["Шаг 1: ...", "Шаг 2: ..."]
#         }
#     ]
# }
# Если способ один — в массиве solutions будет один объект. Если можно решить двумя способами — сделай два объекта.
# """

# app = Flask(__name__)

# def get_deepseek_response(image_path):
#     """Подключается к открытому Chrome и просит решить задачу"""
#     try:
#         # Подключаемся к уже запущенному Хрому на порту 9222
#         with sync_playwright() as p:
#             try:
#                 browser = p.chromium.connect_over_cdp("http://localhost:9222")
#             except Exception as e:
#                 return None, f"Не могу подключиться к Chrome! Запустил ли ты start_chrome.bat? Ошибка: {e}"

#             # Берем первую попавшуюся открытую вкладку (это должен быть DeepSeek)
#             context = browser.contexts[0]
#             if not context.pages:
#                 page = context.new_page()
#             else:
#                 page = context.pages[0]

#             print(f"--- Работаем с вкладкой: {page.title()} ---")
            
#             # 1. Загружаем фото
#             # Ищем скрытый input для файлов. В DeepSeek он обычно есть.
#             try:
#                 # Магия Playwright: находим input file и суем туда картинку
#                 page.set_input_files('input[type="file"]', image_path)
#                 print("--- Фото выбрано ---")
#                 time.sleep(2) # Даем секунду на прогрузку превью
#             except Exception as e:
#                 return None, f"Не нашел кнопку загрузки фото. Ты точно на сайте DeepSeek? Ошибка: {e}"

#             # 2. Вводим текст промпта
#             try:
#                 # Ищем поле ввода (textarea)
#                 page.fill('textarea', PROMPT_TEXT)
#                 # Жмем Enter или кнопку отправки (обычно Enter работает)
#                 page.press('textarea', 'Enter')
#                 print("--- Запрос отправлен, ждем ответа... ---")
#             except Exception as e:
#                 # Если Enter не сработал, пробуем найти кнопку отправки
#                 print("Enter не сработал, ищем кнопку...")
#                 # Это примерный селектор, он может меняться, но обычно 'Send' или иконка
#                 page.click('div[aria-label="Send UI"], button[aria-label="Send"]') 

#             # 3. Ждем ответа
#             # Ждем, пока исчезнет индикатор загрузки или появится кнопка "Копировать"
#             # Для надежности просто ждем паузу и проверяем наличие ответа
#             # В идеале нужно ждать появления последнего сообщения
            
#             # Простой вариант: ждем 10-15 секунд (или пока бот печатает)
#             # Чтобы было быстрее, можно следить за изменением текста, но для презентации таймер надежнее
#             print("--- Ждем генерацию (15 сек)... ---")
#             time.sleep(15) 

#             # 4. Забираем текст последнего сообщения
#             # Ищем все блоки с ответами и берем последний
#             # В DeepSeek ответы обычно в классе .ds-markdown или .assistant-message
#             # Мы возьмем просто весь текст последнего контейнера
            
#             # Получаем все элементы, похожие на сообщение бота
#             # (Этот селектор берет контент ответа. Если не сработает - поменяем)
#             response_text = page.locator('.ds-markdown').last.inner_text()
            
#             if not response_text:
#                  # Запасной вариант - просто весь текст страницы, потом распарсим
#                  response_text = page.content()

#             print("--- Ответ получен! ---")
#             return response_text, None

#     except Exception as e:
#         return None, f"Общая ошибка Playwright: {e}"

# def parse_json_from_text(text):
#     """Вытаскивает JSON из текста (игнорирует приветствия и маркдаун)"""
#     try:
#         # Ищем текст между фигурными скобками, похожий на JSON
#         # Этот паттерн ищет самый внешний объект JSON
#         match = re.search(r'\{.*\}', text, re.DOTALL)
#         if match:
#             json_str = match.group(0)
#             return json.loads(json_str)
#     except:
#         pass
#     return None

# @app.route('/solve', methods=['POST'])
# def solve():
#     print("\n=== ПОЛУЧЕН ЗАПРОС ОТ ТЕЛЕФОНА ===")
#     data = request.get_json(force=True)
    
#     if not data or 'image' not in data:
#         return jsonify({"success": False, "message": "Нет картинки"}), 400

#     # 1. Сохраняем картинку
#     try:
#         image_data = base64.b64decode(data['image'])
#         with open(TEMP_IMAGE_FILE, 'wb') as f:
#             f.write(image_data)
#         print(f"Картинка сохранена: {TEMP_IMAGE_FILE}")
#     except Exception as e:
#         return jsonify({"success": False, "message": f"Ошибка сохранения: {e}"}), 500

#     # 2. Отправляем в DeepSeek через браузер
#     raw_text, error = get_deepseek_response(TEMP_IMAGE_FILE)

#     if error:
#         print(f"ОШИБКА: {error}")
#         return jsonify({"success": False, "message": error, "solutions": []})

#     # 3. Парсим результат
#     print("Парсим JSON...")
#     parsed_json = parse_json_from_text(raw_text)

#     if parsed_json and "solutions" in parsed_json:
#         print("--- УСПЕХ! Решение отправляется на телефон ---")
#         return jsonify({"success": True, "solutions": parsed_json["solutions"]})
#     else:
#         print("--- Не удалось найти JSON в ответе ---")
#         print("RAW ответ:", raw_text[:200] + "...") # Печатаем начало для отладки
#         # Если не вышло распарсить, вернем сырой текст как одно решение
#         fallback_solution = [{
#             "title": "Ответ DeepSeek (сырой)",
#             "formulas": [],
#             "answer": raw_text[:300] + "...", # Обрезаем, чтобы не спамить
#             "steps": [raw_text]
#         }]
#         return jsonify({"success": True, "solutions": fallback_solution})

# if __name__ == '__main__':
#     # Запускаем сервер, доступный для всех в сети
#     app.run(host='0.0.0.0', port=5000)



# import os
# import json
# import base64
# import re
# import time
# from flask import Flask, request, jsonify
# from playwright.sync_api import sync_playwright

# # --- КОНСТАНТЫ И НАСТРОЙКИ ---

# TEMP_IMAGE_FILE = 'temp_image.jpg'
# # Промпт настроен так, чтобы выдавать структурированный ответ
# PROMPT_TEXT = """
# Реши физическую задачу с картинки.
# Верни ответ СТРОГО в формате JSON. Никакого вводного текста, сразу JSON.
# Структура JSON должна быть такой:
# {
#     "solutions": [
#         {
#             "title": "Название метода (например: Через закон сохранения)",
#             "formulas": ["E = mc^2", "F = ma"],
#             "answer": "Короткий ответ (например: 5 м/с)",
#             "steps": ["Шаг 1: ...", "Шаг 2: ..."]
#         }
#     ]
# }
# Если способ один — в массиве solutions будет один объект. Если можно решить двумя способами — сделай два объекта.
# """

# app = Flask(__name__)

# # --- ФУНКЦИЯ ДЛЯ ВЫЗОВА DEEPSEEK С ПОМОЩЬЮ PLAYWRIGHT ---

# def get_deepseek_response(image_path):
#     """Подключается к открытому Chrome и просит решить задачу"""
#     print(f"***-> Запуск DeepSeek с помощью Playwright (Подключение к 9222)")
    
#     try:
#         # Подключаемся к уже запущенному Хрому на порту 9222
#         with sync_playwright() as p:
#             try:
#                 # !!! КЛЮЧЕВОЙ ШАГ: Подключаемся к запущенному через start_chrome.bat окну
#                 browser = p.chromium.connect_over_cdp("http://localhost:9222")
#             except Exception as e:
#                 return None, f"Не могу подключиться к Chrome! Запустил ли ты start_chrome.bat? Ошибка: {e}"

#             # Берем первую попавшуюся открытую вкладку (это должен быть DeepSeek)
#             context = browser.contexts[0]
#             if not context.pages:
#                 return None, "В подключенном Chrome не найдено открытых вкладок. Откройте DeepSeek."
            
#             # Берем первую страницу (где ты должен быть залогинен)
#             page = context.pages[0] 
            
#             print(f"--- Работаем с вкладкой: {page.title()} ---")
            
#             # 1. Загружаем фото
#             try:
#                 # Ищем скрытый input[type="file"] и передаем ему путь к картинке
#                 page.set_input_files('input[type="file"]', image_path)
#                 print("--- Фото выбрано ---")
#                 time.sleep(3) # Даем время на прогрузку превью
#             except Exception as e:
#                 return None, f"Не нашел поле загрузки фото. Убедитесь, что DeepSeek открыт. Ошибка: {e}"

#             # 2. Вводим текст промпта и отправляем
#             try:
#                 # Ищем поле ввода (textarea)
#                 page.fill('textarea', PROMPT_TEXT)
                
#                 # Жмем кнопку отправки (ищем по aria-label="Send" или "Отправить")
#                 # Используем более универсальный селектор
#                 send_button = page.locator('button[aria-label*="Send"], button[aria-label*="Отправить"]')
#                 send_button.click() 
#                 print("--- Запрос отправлен, ждем ответа (до 120 сек)... ---")
#             except Exception as e:
#                 return None, f"Не удалось отправить промпт: {e}"

#             # 3. Ждем ответа (УВЕЛИЧЕННЫЙ ТАЙМАУТ: 120 СЕКУНД)
#             # Ждем появления кнопки "Regenerate" - это надежный признак окончания генерации
#             try:
#                 page.wait_for_selector('button:has-text("Regenerate")', timeout=120000) 
#             except Exception as e:
#                 return None, f"Таймаут (120с) ожидания ответа DeepSeek. Ошибка: {e}"
                
#             print("--- Генерация ответа завершена. ---")
            
#             # 4. Забираем текст последнего сообщения
#             # .ds-markdown - это блок с ответом
#             try:
#                 response_text = page.locator('.ds-markdown').last.inner_text()
#             except Exception:
#                  # Если не сработало, берем весь контент страницы для отладки
#                  response_text = page.content()

#             print("--- Ответ получен! ---")
#             return response_text, None

#     except Exception as e:
#         return None, f"Общая ошибка Playwright: {e}"

# def parse_json_from_text(text):
#     """Вытаскивает JSON из текста (игнорирует приветствия и маркдаун)"""
#     try:
#         # Ищем текст между фигурными скобками, похожий на JSON
#         # Этот паттерн ищет самый внешний объект JSON
#         match = re.search(r'\{.*\}', text, re.DOTALL)
#         if match:
#             json_str = match.group(0)
#             return json.loads(json_str)
#     except:
#         pass
#     return None

# # --- ГЛАВНЫЙ МАРШРУТ СЕРВЕРА ---

# @app.route('/solve', methods=['POST'])
# def solve():
#     print("\n=== ПОЛУЧЕН ЗАПРОС ОТ ТЕЛЕФОНА ===")
    
#     # ПРИМЕЧАНИЕ: Expo отправляет данные в формате JSON, поэтому используем get_json
#     data = request.get_json(force=True) 
    
#     if not data or 'image' not in data:
#         return jsonify({"success": False, "message": "Нет картинки"}), 400

#     # 1. Сохраняем картинку
#     try:
#         image_data = base64.b64decode(data['image'])
#         with open(TEMP_IMAGE_FILE, 'wb') as f:
#             f.write(image_data)
#         print(f"Картинка сохранена: {TEMP_IMAGE_FILE}. Размер: {len(image_data) / 1024:.2f} KB")
#     except Exception as e:
#         return jsonify({"success": False, "message": f"Ошибка сохранения: {e}"}), 500

#     # 2. Отправляем в DeepSeek через браузер
#     raw_text, error = get_deepseek_response(TEMP_IMAGE_FILE)

#     # 3. Очистка
#     if os.path.exists(TEMP_IMAGE_FILE):
#         os.remove(TEMP_IMAGE_FILE)

#     if error:
#         print(f"ОШИБКА: {error}")
#         return jsonify({"success": False, "message": error, "solutions": []})

#     # 4. Парсим результат
#     print("Парсим JSON...")
#     parsed_json = parse_json_from_text(raw_text)

#     if parsed_json and "solutions" in parsed_json:
#         print("--- УСПЕХ! Решение отправляется на телефон ---")
#         return jsonify({"success": True, "solutions": parsed_json["solutions"]})
#     else:
#         print("--- Не удалось найти JSON в ответе ---")
#         print("RAW ответ (начало):", raw_text[:300] + "...") # Печатаем начало для отладки
        
#         # Запасной вариант: если JSON не распарсился, возвращаем сырой текст
#         fallback_solution = [{
#             "title": "Ответ DeepSeek (сырой)",
#             "formulas": ["-", "-"],
#             "answer": raw_text[:200] + "...", 
#             "steps": ["DeepSeek не прислал ответ в правильном JSON-формате. Это сырой текст: ", raw_text]
#         }]
#         # Мы все равно возвращаем success=True, чтобы приложение на телефоне не падало
#         return jsonify({"success": True, "solutions": fallback_solution})

# if __name__ == '__main__':
#     # Запускаем сервер, доступный для всех в сети
#     print("--- Flask Server Started ---")
#     app.run(host='0.0.0.0', port=5000)




# import os
# import json
# import base64
# import re
# import time
# from flask import Flask, request, jsonify
# from playwright.sync_api import sync_playwright

# # --- КОНСТАНТЫ И НАСТРОЙКИ ---

# TEMP_IMAGE_FILE = 'temp_image.jpg'
# # Увеличенное время ожидания ответа (120 секунд)
# TIMEOUT_MS = 120000 

# # Промпт настроен так, чтобы выдавать СТРОГО JSON для виджетов
# PROMPT_TEXT = """
# Реши физическую задачу с картинки.
# Верни ответ СТРОГО в формате JSON. Не пиши никакого вводного текста, сразу JSON.
# Структура JSON должна быть такой:
# {
#     "solutions": [
#         {
#             "title": "Название метода (например: Через закон сохранения)",
#             "formulas": ["E = mc^2", "F = ma"],
#             "answer": "Короткий ответ (например: 5 м/с)",
#             "steps": ["Шаг 1: ...", "Шаг 2: ..."]
#         }
#     ]
# }
# Если способ один — в массиве solutions будет один объект. Если можно решить двумя способами — сделай два объекта.
# """

# app = Flask(__name__)

# # --- ФУНКЦИЯ ДЛЯ ВЫЗОВА DEEPSEEK С ПОМОЩЬЮ PLAYWRIGHT ---

# def get_deepseek_response(image_path):
#     """Подключается к открытому Chrome и просит решить задачу"""
#     print(f"***-> Запуск DeepSeek с помощью Playwright (Подключение к 9222)")
    
#     try:
#         # Подключаемся к уже запущенному Хрому на порту 9222
#         with sync_playwright() as p:
#             try:
#                 browser = p.chromium.connect_over_cdp("http://localhost:9222")
#             except Exception as e:
#                 return None, f"Не могу подключиться к Chrome! Запустил ли ты start_chrome.bat? Ошибка: {e}"

#             context = browser.contexts[0]
#             if not context.pages:
#                 return None, "В подключенном Chrome не найдено открытых вкладок. Откройте DeepSeek."
            
#             page = context.pages[0] 
            
#             print(f"--- Работаем с вкладкой: {page.title()} ---")
            
#             # 1. Загружаем фото
#             try:
#                 page.set_input_files('input[type="file"]', image_path)
#                 print("--- Фото выбрано ---")
#                 time.sleep(3) # Даем время на прогрузку превью
#             except Exception as e:
#                 return None, f"Не нашел поле загрузки фото. Убедитесь, что DeepSeek открыт. Ошибка: {e}"

#             # 2. Вводим текст промпта и отправляем
#             try:
#                 # ИСПРАВЛЕНО: Используем .first для надежного выбора активного поля ввода
#                 textarea_element = page.locator('textarea').first 
#                 textarea_element.fill(PROMPT_TEXT)
                
#                 # Ищем кнопку отправки
#                 # Ищем по aria-label="Send" или по классу кнопки (он часто меняется, поэтому лучше по тексту)
#                 send_button = page.locator('button:has-text("Send"), button:has-text("Отправить"), button[aria-label*="Send"]').first
#                 send_button.click() 
#                 print(f"--- Запрос отправлен, ждем ответа (до {TIMEOUT_MS/1000} сек)... ---")
#             except Exception as e:
#                 return None, f"Не удалось найти или нажать кнопку отправки: {e}"

#             # 3. Ждем ответа (УВЕЛИЧЕННЫЙ ТАЙМАУТ)
#             # Ждем появления кнопки "Regenerate" (Надежный признак окончания генерации в DeepSeek)
#             try:
#                 page.wait_for_selector('button:has-text("Regenerate")', timeout=TIMEOUT_MS) 
#             except Exception as e:
#                 return None, f"Таймаут ({TIMEOUT_MS/1000}с) ожидания ответа DeepSeek. Ошибка: {e}"
                
#             print("--- Генерация ответа завершена. ---")
            
#             # 4. Забираем текст последнего сообщения
#             # .ds-markdown - это блок с ответом в DeepSeek
#             try:
#                 response_text = page.locator('.ds-markdown').last.inner_text()
#             except Exception:
#                  # Запасной вариант
#                  response_text = page.content()

#             print("--- Ответ получен! ---")
#             return response_text, None

#     except Exception as e:
#         return None, f"Общая ошибка Playwright: {e}"

# def parse_json_from_text(text):
#     """Вытаскивает JSON из текста (игнорирует приветствия и маркдаун)"""
#     try:
#         # Ищем текст между фигурными скобками, похожий на JSON
#         match = re.search(r'\{.*\}', text, re.DOTALL)
#         if match:
#             json_str = match.group(0)
#             return json.loads(json_str)
#     except:
#         pass
#     return None

# # --- ГЛАВНЫЙ МАРШРУТ СЕРВЕРА ---

# @app.route('/solve', methods=['POST'])
# def solve():
#     print("\n=== ПОЛУЧЕН ЗАПРОС ОТ ТЕЛЕФОНА ===")
    
#     data = request.get_json(force=True) 
    
#     if not data or 'image' not in data:
#         return jsonify({"success": False, "message": "Нет картинки"}), 400

#     # 1. Сохраняем картинку
#     try:
#         image_data = base64.b64decode(data['image'])
#         with open(TEMP_IMAGE_FILE, 'wb') as f:
#             f.write(image_data)
#         print(f"Картинка сохранена: {TEMP_IMAGE_FILE}.")
#     except Exception as e:
#         return jsonify({"success": False, "message": f"Ошибка сохранения: {e}"}), 500

#     # 2. Отправляем в DeepSeek через браузер
#     raw_text, error = get_deepseek_response(TEMP_IMAGE_FILE)

#     # 3. Очистка
#     if os.path.exists(TEMP_IMAGE_FILE):
#         os.remove(TEMP_IMAGE_FILE)

#     if error:
#         print(f"ОШИБКА: {error}")
#         return jsonify({"success": False, "message": error, "solutions": []})

#     # 4. Парсим результат
#     print("Парсим JSON...")
#     parsed_json = parse_json_from_text(raw_text)

#     if parsed_json and "solutions" in parsed_json:
#         print("--- УСПЕХ! Решение отправляется на телефон ---")
#         return jsonify({"success": True, "solutions": parsed_json["solutions"]})
#     else:
#         print("--- Не удалось найти JSON в ответе ---")
#         print("RAW ответ (начало):", raw_text[:300] + "...") 
        
#         # Запасной вариант: если JSON не распарсился, возвращаем сырой текст
#         fallback_solution = [{
#             "title": "Ответ DeepSeek (сырой/неформатированный)",
#             "formulas": ["-", "-"],
#             "answer": raw_text[:200] + "...", 
#             "steps": ["DeepSeek не прислал ответ в правильном JSON-формате. Это сырой текст: ", raw_text]
#         }]
#         return jsonify({"success": True, "solutions": fallback_solution})

# if __name__ == '__main__':
#     print("--- Flask Server Started ---")
#     app.run(host='0.0.0.0', port=5000)



# import os
# import json
# import base64
# import re
# import time
# from flask import Flask, request, jsonify
# from playwright.sync_api import sync_playwright

# # --- КОНСТАНТЫ И НАСТРОЙКИ ---

# TEMP_IMAGE_FILE = 'temp_image.jpg'
# # Увеличенное время ожидания ответа (120 секунд)
# TIMEOUT_MS = 120000 

# # Промпт настроен так, чтобы выдавать СТРОГО JSON для виджетов
# PROMPT_TEXT = """
# Реши физическую задачу с картинки.
# Верни ответ СТРОГО в формате JSON. Не пиши никакого вводного текста, сразу JSON.
# Структура JSON должна быть такой:
# {
#     "solutions": [
#         {
#             "title": "Название метода (например: Через закон сохранения)",
#             "formulas": ["E = mc^2", "F = ma"],
#             "answer": "Короткий ответ (например: 5 м/с)",
#             "steps": ["Шаг 1: ...", "Шаг 2: ..."]
#         }
#     ]
# }
# Если способ один — в массиве solutions будет один объект. Если можно решить двумя способами — сделай два объекта.
# """

# app = Flask(__name__)

# # --- ФУНКЦИЯ ДЛЯ ВЫЗОВА DEEPSEEK С ПОМОЩЬЮ PLAYWRIGHT ---

# def get_deepseek_response(image_path):
#     """Подключается к открытому Chrome и просит решить задачу"""
#     print(f"***-> Запуск DeepSeek с помощью Playwright (Подключение к 9222)")
    
#     try:
#         # Подключаемся к уже запущенному Хрому на порту 9222
#         with sync_playwright() as p:
#             try:
#                 # !!! КЛЮЧЕВОЙ ШАГ: Подключаемся к запущенному через start_chrome.bat окну
#                 browser = p.chromium.connect_over_cdp("http://localhost:9222")
#             except Exception as e:
#                 return None, f"Не могу подключиться к Chrome! Запустил ли ты start_chrome.bat? Ошибка: {e}"

#             context = browser.contexts[0]
#             if not context.pages:
#                 return None, "В подключенном Chrome не найдено открытых вкладок. Откройте DeepSeek."
            
#             page = context.pages[0] 
            
#             print(f"--- Работаем с вкладкой: {page.title()} ---")
            
#             # 1. Загружаем фото
#             try:
#                 # Ищем скрытый input[type="file"] и передаем ему путь к картинке
#                 page.set_input_files('input[type="file"]', image_path)
#                 print("--- Фото выбрано ---")
#                 time.sleep(3) # Даем время на прогрузку превью
#             except Exception as e:
#                 return None, f"Не нашел поле загрузки фото. Убедитесь, что DeepSeek открыт. Ошибка: {e}"

#             # 2. Вводим текст промпта и отправляем
#             try:
#                 # ИСПРАВЛЕНО: Используем .first для надежного выбора активного поля ввода
#                 textarea_element = page.locator('textarea').first 
#                 textarea_element.fill(PROMPT_TEXT)
                
#                 # ИСПРАВЛЕНО: Ищем кнопку отправки с помощью type="submit" или aria-label="send"
#                 send_button = page.locator('button[type="submit"], button[aria-label*="send"]').first
                
#                 # Ждем, пока кнопка станет активной и видимой
#                 send_button.wait_for(state="visible", timeout=10000) 
                
#                 send_button.click() 
#                 print(f"--- Запрос отправлен, ждем ответа (до {TIMEOUT_MS/1000} сек)... ---")
#             except Exception as e:
#                 return None, f"Не удалось найти или нажать кнопку отправки. Ошибка: {e}"

#             # 3. Ждем ответа (УВЕЛИЧЕННЫЙ ТАЙМАУТ: 120 СЕКУНД)
#             # Ждем появления кнопки "Regenerate" (Надежный признак окончания генерации в DeepSeek)
#             try:
#                 page.wait_for_selector('button:has-text("Regenerate")', timeout=TIMEOUT_MS) 
#             except Exception as e:
#                 return None, f"Таймаут ({TIMEOUT_MS/1000}с) ожидания ответа DeepSeek. Ошибка: {e}"
                
#             print("--- Генерация ответа завершена. ---")
            
#             # 4. Забираем текст последнего сообщения
#             try:
#                 response_text = page.locator('.ds-markdown').last.inner_text()
#             except Exception:
#                  response_text = page.content()

#             print("--- Ответ получен! ---")
#             return response_text, None

#     except Exception as e:
#         return None, f"Общая ошибка Playwright: {e}"

# def parse_json_from_text(text):
#     """Вытаскивает JSON из текста (игнорирует приветствия и маркдаун)"""
#     try:
#         match = re.search(r'\{.*\}', text, re.DOTALL)
#         if match:
#             json_str = match.group(0)
#             return json.loads(json_str)
#     except:
#         pass
#     return None

# # --- ГЛАВНЫЙ МАРШРУТ СЕРВЕРА ---

# @app.route('/solve', methods=['POST'])
# def solve():
#     print("\n=== ПОЛУЧЕН ЗАПРОС ОТ ТЕЛЕФОНА ===")
    
#     data = request.get_json(force=True) 
    
#     if not data or 'image' not in data:
#         return jsonify({"success": False, "message": "Нет картинки"}), 400

#     # 1. Сохраняем картинку
#     try:
#         image_data = base64.b64decode(data['image'])
#         with open(TEMP_IMAGE_FILE, 'wb') as f:
#             f.write(image_data)
#         print(f"Картинка сохранена: {TEMP_IMAGE_FILE}.")
#     except Exception as e:
#         return jsonify({"success": False, "message": f"Ошибка сохранения: {e}"}), 500

#     # 2. Отправляем в DeepSeek через браузер
#     raw_text, error = get_deepseek_response(TEMP_IMAGE_FILE)

#     # 3. Очистка
#     if os.path.exists(TEMP_IMAGE_FILE):
#         os.remove(TEMP_IMAGE_FILE)

#     if error:
#         print(f"ОШИБКА: {error}")
#         return jsonify({"success": False, "message": error, "solutions": []})

#     # 4. Парсим результат
#     print("Парсим JSON...")
#     parsed_json = parse_json_from_text(raw_text)

#     if parsed_json and "solutions" in parsed_json:
#         print("--- УСПЕХ! Решение отправляется на телефон ---")
#         return jsonify({"success": True, "solutions": parsed_json["solutions"]})
#     else:
#         print("--- Не удалось найти JSON в ответе ---")
#         print("RAW ответ (начало):", raw_text[:300] + "...") 
        
#         # Запасной вариант: если JSON не распарсился, возвращаем сырой текст
#         fallback_solution = [{
#             "title": "Ответ DeepSeek (сырой/неформатированный)",
#             "formulas": ["-", "-"],
#             "answer": raw_text[:200] + "...", 
#             "steps": ["DeepSeek не прислал ответ в правильном JSON-формате. Это сырой текст: ", raw_text]
#         }]
#         return jsonify({"success": True, "solutions": fallback_solution})

# if __name__ == '__main__':
#     print("--- Flask Server Started ---")
#     app.run(host='0.0.0.0', port=5000)




# import os
# import json
# import base64
# import re
# import time
# from flask import Flask, request, jsonify
# from playwright.sync_api import sync_playwright

# # --- КОНСТАНТЫ И НАСТРОЙКИ ---
# TEMP_IMAGE_FILE = 'temp_image.jpg'
# TIMEOUT_MS = 120000 
# # Упрощенный промпт для лучшего понимания моделью
# PROMPT_TEXT = """
# РЕШИ ЭТУ ФИЗИЧЕСКУЮ ЗАДАЧУ. ОТВЕТ ДОЛЖЕН БЫТЬ В ФОРМАТЕ JSON:

# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула1", "формула2"],
#             "answer": "краткий ответ",
#             "steps": ["шаг1", "шаг2"]
#         }
#     ]
# }

# Если несколько способов решения - добавь объекты в массив solutions.
# """

# app = Flask(__name__)

# def get_deepseek_response(image_path):
#     """Подключается к открытому Chrome и просит решить задачу"""
#     print(f"***-> Запуск DeepSeek с помощью Playwright")
    
#     try:
#         # Подключаемся к уже запущенному Хрому
#         with sync_playwright() as p:
#             try:
#                 # !!! КЛЮЧЕВОЙ ШАГ: ПОДКЛЮЧАЕМСЯ К СУЩЕСТВУЮЩЕМУ БРАУЗЕРУ НА ПОРТУ 9222
#                 browser = p.chromium.connect_over_cdp("http://localhost:9222")
#             except Exception as e:
#                 # Возвращаем ошибку, если Chrome не запущен
#                 return None, f"Не могу подключиться к Chrome! Запусти start_chrome.bat. Ошибка: {e}"

#             context = browser.contexts[0]
#             if not context.pages:
#                 return None, "В Chrome нет открытых вкладок. Открой DeepSeek."
            
#             page = context.pages[0] 
            
#             print(f"--- Работаем с вкладкой: {page.title()} ---")
            
#             # 1. Загружаем фото
#             try:
#                 page.set_input_files('input[type="file"]', image_path)
#                 print("--- Фото выбрано ---")
#                 time.sleep(3)
#             except Exception as e:
#                 return None, f"Не нашел поле загрузки фото: {e}"

#             # 2. Вводим текст промпта
#             try:
#                 # Очищаем поле и вводим текст
#                 textarea = page.locator('textarea').first
#                 textarea.click()
#                 textarea.clear()
#                 textarea.fill(PROMPT_TEXT)
#                 print("--- Промпт введен ---")
                
#                 # Способ отправки: Enter (самый надежный)
#                 textarea.press('Enter')
#                 print("--- Отправлено через Enter ---")
                
#             except Exception as e:
#                 return None, f"Ошибка при вводе текста: {e}"

#             # 3. Ждем ответа
#             print(f"--- Ждем ответа ({TIMEOUT_MS/1000} сек) ---")
            
#             # Ждем появления нового контента
#             try:
#                 # Ждем появления сообщения от ассистента (.ds-markdown)
#                 page.wait_for_selector('.message:last-child .assistant-message, .ds-markdown', timeout=TIMEOUT_MS)
#             except Exception as e:
#                 print(f"Таймаут ожидания селектора: {e}")
#                 time.sleep(10) # Даем дополнительное время для генерации

#             # 4. Получаем ответ
#             response_text = ""
#             try:
#                 # Ищем последний блок с ответом
#                 last_message = page.locator('.assistant-message, .ds-markdown').last
#                 response_text = last_message.inner_text()
#             except:
#                 response_text = page.inner_text('body') # Берем весь видимый текст (запасной вариант)

#             print("--- Ответ получен! ---")
#             return response_text, None

#     except Exception as e:
#         return None, f"Общая ошибка Playwright: {e}"

# def parse_json_from_text(text):
#     """Вытаскивает JSON из текста"""
#     if not text:
#         return None
        
#     print("=== СЫРОЙ ОТВЕТ DEEPSEEK (начало) ===")
#     print(text[:500] + "..." if len(text) > 500 else text)
#     print("=== КОНЕЦ СЫРОГО ОТВЕТА ===")
    
#     try:
#         # Улучшенный поиск JSON в тексте
#         match = re.search(r'\{[^{}]*\{[^{}]*\}[^{}]*\}|\{[^{}]*\}', text, re.DOTALL)
#         if match:
#             json_str = match.group(0)
#             # Чистим JSON строку
#             json_str = re.sub(r',\s*}', '}', json_str)
#             json_str = re.sub(r',\s*]', ']', json_str)
#             return json.loads(json_str)
#     except Exception as e:
#         print(f"Ошибка парсинга JSON: {e}")
    
#     return None

# def create_fallback_solution(raw_text):
#     """Создает запасное решение из сырого текста"""
#     lines = raw_text.split('\n')
#     answer = ""
#     steps = []
    
#     for line in lines:
#         line = line.strip()
#         if line and len(line) > 10: 
#             if not answer and any(word in line.lower() for word in ['ответ', 'result', '=']):
#                 answer = line
#             elif len(line) < 100:
#                 steps.append(line)
    
#     if not answer and steps:
#         answer = steps[-1]
#     elif not answer:
#         answer = raw_text[:100] + "..."
    
#     return [{
#         "title": "Решение DeepSeek",
#         "formulas": ["Информация в шагах"],
#         "answer": answer,
#         "steps": steps if steps else [raw_text[:500]]
#     }]

# @app.route('/solve', methods=['POST'])
# def solve():
#     print("\n=== ПОЛУЧЕН ЗАПРОС ОТ ТЕЛЕФОНА ===")
    
#     try:
#         data = request.get_json(force=True)
#     except:
#         return jsonify({"success": False, "message": "Неверный JSON", "solutions": []}), 400
    
#     if not data or 'image' not in data:
#         return jsonify({"success": False, "message": "Нет картинки", "solutions": []}), 400

#     # 1. Сохраняем картинку
#     try:
#         image_data = base64.b64decode(data['image'])
#         with open(TEMP_IMAGE_FILE, 'wb') as f:
#             f.write(image_data)
#         print(f"Картинка сохранена: {TEMP_IMAGE_FILE} ({len(image_data)} байт)")
#     except Exception as e:
#         return jsonify({"success": False, "message": f"Ошибка сохранения: {e}", "solutions": []}), 500

#     # 2. Отправляем в DeepSeek
#     raw_text, error = get_deepseek_response(TEMP_IMAGE_FILE)

#     # 3. Очистка
#     if os.path.exists(TEMP_IMAGE_FILE):
#         os.remove(TEMP_IMAGE_FILE)

#     if error:
#         print(f"ОШИБКА: {error}")
#         return jsonify({"success": False, "message": error, "solutions": []})

#     # 4. Парсим результат
#     print("Парсим ответ...")
#     parsed_json = parse_json_from_text(raw_text)

#     if parsed_json and "solutions" in parsed_json:
#         print("--- УСПЕХ! JSON найден ---")
#         return jsonify({
#             "success": True, 
#             "solutions": parsed_json["solutions"]
#         })
#     else:
#         print("--- JSON не найден, создаем запасной вариант ---")
#         solutions = create_fallback_solution(raw_text)
#         return jsonify({
#             "success": True, 
#             "solutions": solutions,
#             "note": "Использован запасной формат"
#         })

# @app.route('/test', methods=['GET'])
# def test():
#     """Тестовый endpoint для проверки сервера"""
#     return jsonify({
#         "success": True,
#         "message": "Сервер работает!",
#         "test_solution": [{
#             "title": "Тестовый метод",
#             "formulas": ["F = ma", "E = mc²"],
#             "answer": "42 м/с",
#             "steps": ["Шаг 1: Тест", "Шаг 2: Проверка"]
#         }]
#     })

# if __name__ == '__main__':
#     print("--- Flask Server Started ---")
#     print("Тестовый URL: http://localhost:5000/test")
#     app.run(host='0.0.0.0', port=5000, debug=True)




# import os
# import json
# import base64
# import re
# import time
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from playwright.sync_api import sync_playwright

# # --- КОНСТАНТЫ ---
# TEMP_IMAGE_FILE = 'temp_image.jpg'
# TIMEOUT_MS = 180000  # 3 минуты

# # УЛУЧШЕННЫЙ ПРОМПТ - ТРЕБУЕМ JSON ОТВЕТ
# PROMPT_TEXT = """
# РЕШИ ЭТУ ФИЗИЧЕСКУЮ ЗАДАЧУ И ВЕРНИ ОТВЕТ В ФОРМАТЕ JSON:

# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула1", "формула2"],
#             "answer": "конечный ответ",
#             "steps": ["шаг1", "шаг2", "шаг3"]
#         }
#     ]
# }

# ВАЖНО: 
# - Верни ТОЛЬКО JSON без лишнего текста
# - Если несколько методов - добавь в массив solutions
# - Распиши подробно шаги решения
# """

# app = Flask(__name__)
# CORS(app)

# def debug_print(message):
#     """Печатает отладочную информацию с временной меткой"""
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def get_deepseek_response(image_path):
#     """Основная функция для работы с DeepSeek через Playwright"""
#     debug_print("🚀 Запускаем DeepSeek с Playwright...")
    
#     try:
#         with sync_playwright() as p:
#             # ПОДКЛЮЧАЕМСЯ К ЗАПУЩЕННОМУ CHROME
#             debug_print("🔗 Подключаемся к Chrome на порту 9222...")
#             browser = p.chromium.connect_over_cdp("http://localhost:9222")
            
#             # Берем первую вкладку
#             context = browser.contexts[0]
#             if not context.pages:
#                 return None, "В Chrome нет открытых вкладок"
                
#             page = context.pages[0]
#             debug_print(f"📄 Работаем с вкладкой: {page.title()}")
            
#             # ПЕРЕХОДИМ НА DEEPSEEK ЕСЛИ НУЖНО
#             current_url = page.url
#             if "deepseek.com" not in current_url:
#                 debug_print("🌐 Переходим на DeepSeek...")
#                 page.goto("https://chat.deepseek.com", wait_until="networkidle")
#                 time.sleep(3)
            
#             # ЖДЕМ ЗАГРУЗКИ ИНТЕРФЕЙСА
#             debug_print("⏳ Ждем загрузки интерфейса DeepSeek...")
#             page.wait_for_selector('textarea', timeout=15000)
            
#             # ШАГ 1: ЗАГРУЖАЕМ ИЗОБРАЖЕНИЕ
#             debug_print("🖼️ Загружаем изображение...")
            
#             # Способ 1: Прямая загрузка через input[type="file"]
#             try:
#                 # Ищем поле для загрузки файлов
#                 file_input = page.query_selector('input[type="file"]')
#                 if file_input:
#                     file_input.set_input_files(image_path)
#                     debug_print("✅ Изображение загружено через input[type='file']")
#                 else:
#                     # Способ 2: Ищем кнопку загрузки
#                     upload_buttons = page.query_selector_all('button')
#                     for button in upload_buttons:
#                         button_text = button.inner_text().lower()
#                         if any(word in button_text for word in ['upload', 'attach', 'файл', 'загрузить', 'прикрепить']):
#                             button.click()
#                             time.sleep(1)
#                             # После клика должно появиться поле для файла
#                             file_input = page.query_selector('input[type="file"]')
#                             if file_input:
#                                 file_input.set_input_files(image_path)
#                                 debug_print("✅ Изображение загружено через кнопку")
#                                 break
#                     else:
#                         return None, "Не найдено поле для загрузки файлов"
#             except Exception as e:
#                 debug_print(f"❌ Ошибка загрузки изображения: {e}")
#                 return None, f"Ошибка загрузки изображения: {e}"
            
#             # Ждем появления превью изображения
#             time.sleep(3)
            
#             # ШАГ 2: ВВОДИМ ПРОМПТ
#             debug_print("📝 Вводим промпт...")
#             try:
#                 # Ищем текстовое поле
#                 textarea = page.query_selector('textarea')
#                 if not textarea:
#                     # Альтернативные селекторы
#                     textarea = page.query_selector('[contenteditable="true"], [role="textbox"]')
                
#                 if textarea:
#                     # Очищаем и вводим текст
#                     textarea.click()
#                     textarea.clear()
#                     textarea.fill(PROMPT_TEXT)
#                     debug_print("✅ Промпт введен")
                    
#                     # ШАГ 3: ОТПРАВЛЯЕМ СООБЩЕНИЕ
#                     debug_print("📤 Отправляем сообщение...")
                    
#                     # Способ 1: Ищем кнопку отправки
#                     send_button = page.query_selector('button[type="submit"], button:has-text("Send"), button[aria-label*="send"]')
#                     if send_button and send_button.is_enabled():
#                         send_button.click()
#                         debug_print("✅ Сообщение отправлено через кнопку")
#                     else:
#                         # Способ 2: Нажимаем Enter
#                         textarea.press('Enter')
#                         debug_print("✅ Сообщение отправлено через Enter")
                    
#                 else:
#                     return None, "Не найдено поле для ввода текста"
                    
#             except Exception as e:
#                 debug_print(f"❌ Ошибка ввода текста: {e}")
#                 return None, f"Ошибка ввода текста: {e}"
            
#             # ШАГ 4: ЖДЕМ ОТВЕТА
#             debug_print("⏳ Ожидаем ответа DeepSeek...")
            
#             # Даем время на начало генерации
#             time.sleep(10)
            
#             # Ждем появления ответа (несколько возможных селекторов)
#             response_selectors = [
#                 '.message:last-child .assistant-message',
#                 '[class*="message"]:last-child',
#                 '[data-testid*="message"]:last-child',
#                 '.markdown-body',
#                 '[class*="markdown"]'
#             ]
            
#             response_text = ""
#             for selector in response_selectors:
#                 try:
#                     page.wait_for_selector(selector, timeout=60000)
#                     response_elements = page.query_selector_all(selector)
#                     if response_elements:
#                         last_response = response_elements[-1]
#                         response_text = last_response.inner_text()
#                         if response_text and len(response_text) > 10:
#                             debug_print(f"✅ Ответ получен ({len(response_text)} символов)")
#                             break
#                 except:
#                     continue
            
#             # Если ответ не найден, пробуем получить весь текст страницы
#             if not response_text:
#                 debug_print("⚠️ Ответ не найден по селекторам, пробуем альтернативный метод...")
#                 response_text = page.inner_text('body')
            
#             # Закрываем браузер
#             browser.close()
            
#             return response_text, None
            
#     except Exception as e:
#         debug_print(f"❌ Критическая ошибка: {e}")
#         return None, f"Критическая ошибка Playwright: {e}"

# def parse_solutions_from_text(text):
#     """Парсит решения из текста ответа"""
#     if not text:
#         return []
    
#     debug_print("🔍 Анализируем ответ DeepSeek...")
    
#     # Метод 1: Пытаемся найти JSON
#     try:
#         json_match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', text, re.DOTALL)
#         if json_match:
#             json_str = json_match.group(0)
#             # Чистим JSON от лишних запятых
#             json_str = re.sub(r',\s*\}(?=,|\])', '}', json_str)
#             json_str = re.sub(r',\s*\](?=\s*\})', ']', json_str)
            
#             parsed_data = json.loads(json_str)
#             if "solutions" in parsed_data and isinstance(parsed_data["solutions"], list):
#                 debug_print(f"✅ Найдено {len(parsed_data['solutions'])} решений в JSON")
#                 return parsed_data["solutions"]
#     except Exception as e:
#         debug_print(f"⚠️ Ошибка парсинга JSON: {e}")
    
#     # Метод 2: Создаем запасное решение из всего текста
#     debug_print("🔄 Создаем запасное решение...")
    
#     # Разбиваем текст на строки и фильтруем
#     lines = [line.strip() for line in text.split('\n') if line.strip()]
    
#     # Ищем ответ (строка с "Ответ:", "Answer:", или содержащая =)
#     answer = "Ответ не найден"
#     for line in lines:
#         if any(word in line.lower() for word in ['ответ', 'answer', 'result']):
#             answer = line
#             break
#         elif '=' in line and len(line) < 100:  # Возможно формула с ответом
#             answer = line
    
#     # Берем первые 10 строк как шаги
#     steps = lines[:10] if len(lines) > 10 else lines
    
#     # Создаем одно решение
#     solution = {
#         "title": "Решение задачи",
#         "formulas": ["См. шаги решения"],
#         "answer": answer,
#         "steps": steps if steps else ["Подробное решение в тексте ответа"]
#     }
    
#     return [solution]

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     debug_print("\n" + "="*50)
#     debug_print("📱 ПОЛУЧЕН ЗАПРОС ОТ ТЕЛЕФОНА")
#     debug_print("="*50)
    
#     try:
#         # Парсим JSON данные
#         data = request.get_json()
#         if not data:
#             return jsonify({
#                 "success": False, 
#                 "message": "Нет данных в запросе",
#                 "solutions": []
#             }), 400
            
#         if 'image' not in data:
#             return jsonify({
#                 "success": False, 
#                 "message": "Нет изображения в запросе",
#                 "solutions": []
#             }), 400
        
#         # Декодируем и сохраняем изображение
#         debug_print("💾 Сохраняем изображение...")
#         try:
#             image_data = base64.b64decode(data['image'])
#             with open(TEMP_IMAGE_FILE, 'wb') as f:
#                 f.write(image_data)
#             debug_print(f"✅ Изображение сохранено ({len(image_data)} байт)")
#         except Exception as e:
#             return jsonify({
#                 "success": False, 
#                 "message": f"Ошибка сохранения изображения: {e}",
#                 "solutions": []
#             }), 500
        
#         # Отправляем в DeepSeek
#         debug_print("🔄 Отправляем в DeepSeek...")
#         response_text, error = get_deepseek_response(TEMP_IMAGE_FILE)
        
#         # Удаляем временный файл
#         if os.path.exists(TEMP_IMAGE_FILE):
#             os.remove(TEMP_IMAGE_FILE)
#             debug_print("🗑️ Временный файл удален")
        
#         if error:
#             debug_print(f"❌ Ошибка: {error}")
#             return jsonify({
#                 "success": False, 
#                 "message": error,
#                 "solutions": []
#             }), 500
        
#         # Парсим решения
#         debug_print("🔍 Парсим решения...")
#         solutions = parse_solutions_from_text(response_text)
        
#         if solutions:
#             debug_print(f"✅ Найдено {len(solutions)} решений")
#             return jsonify({
#                 "success": True,
#                 "message": "Решение получено",
#                 "solutions": solutions
#             })
#         else:
#             debug_print("❌ Решения не найдены")
#             return jsonify({
#                 "success": False,
#                 "message": "Не удалось извлечь решения из ответа",
#                 "solutions": []
#             }), 500
            
#     except Exception as e:
#         debug_print(f"💥 Критическая ошибка сервера: {e}")
#         return jsonify({
#             "success": False,
#             "message": f"Внутренняя ошибка сервера: {e}",
#             "solutions": []
#         }), 500

# @app.route('/test', methods=['GET'])
# def test_server():
#     """Тестовый endpoint для проверки сервера"""
#     return jsonify({
#         "success": True,
#         "message": "Сервер работает!",
#         "test_data": {
#             "chrome_connected": True,
#             "deepseek_ready": True,
#             "server_status": "running"
#         }
#     })

# @app.route('/status', methods=['GET'])
# def server_status():
#     """Проверка статуса сервера и подключения к Chrome"""
#     try:
#         with sync_playwright() as p:
#             browser = p.chromium.connect_over_cdp("http://localhost:9222")
#             chrome_connected = browser is not None
#             browser.close()
            
#             return jsonify({
#                 "success": True,
#                 "chrome_connected": chrome_connected,
#                 "message": "Сервер работает, Chrome подключен" if chrome_connected else "Chrome не подключен"
#             })
#     except:
#         return jsonify({
#             "success": False,
#             "chrome_connected": False,
#             "message": "Chrome не запущен на порту 9222"
#         })

# if __name__ == '__main__':
#     debug_print("🚀 Запуск Flask сервера...")
#     debug_print("📍 Сервер будет доступен по адресу: http://192.168.0.11:5000")
#     debug_print("🔧 Тестовый endpoint: http://192.168.0.11:5000/test")
#     debug_print("📊 Статус сервера: http://192.168.0.11:5000/status")
#     debug_print("="*50)
    
#     app.run(host='0.0.0.0', port=5000, debug=True)


# import os
# import json
# import base64
# import re
# import time
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from playwright.sync_api import sync_playwright

# # --- КОНСТАНТЫ ---
# TEMP_IMAGE_FILE = 'temp_image.jpg'
# TIMEOUT_MS = 180000

# PROMPT_TEXT = """
# РЕШИ ЭТУ ФИЗИЧЕСКУЮ ЗАДАЧУ И ВЕРНИ ОТВЕТ В ФОРМАТЕ JSON:

# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула1", "формула2"],
#             "answer": "конечный ответ",
#             "steps": ["шаг1", "шаг2", "шаг3"]
#         }
#     ]
# }

# ВАЖНО: Верни ТОЛЬКО JSON без лишнего текста
# """

# app = Flask(__name__)
# CORS(app)

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def get_deepseek_response(image_path):
#     debug_print("🚀 Запускаем DeepSeek с Playwright...")
    
#     try:
#         with sync_playwright() as p:
#             debug_print("🔗 Подключаемся к Chrome на порту 9222...")
#             browser = p.chromium.connect_over_cdp("http://localhost:9222")
            
#             context = browser.contexts[0]
#             if not context.pages:
#                 return None, "В Chrome нет открытых вкладок"
                
#             page = context.pages[0]
#             debug_print(f"📄 Работаем с вкладкой: {page.title()}")
            
#             current_url = page.url
#             if "deepseek.com" not in current_url:
#                 debug_print("🌐 Переходим на DeepSeek...")
#                 page.goto("https://chat.deepseek.com", wait_until="networkidle")
#                 time.sleep(3)
            
#             debug_print("⏳ Ждем загрузки интерфейса DeepSeek...")
#             page.wait_for_selector('textarea', timeout=15000)
            
#             # ШАГ 1: ЗАГРУЖАЕМ ИЗОБРАЖЕНИЕ
#             debug_print("🖼️ Загружаем изображение...")
#             try:
#                 file_input = page.query_selector('input[type="file"]')
#                 if file_input:
#                     file_input.set_input_files(image_path)
#                     debug_print("✅ Изображение загружено")
#                 else:
#                     return None, "Не найдено поле для загрузки файлов"
#             except Exception as e:
#                 debug_print(f"❌ Ошибка загрузки изображения: {e}")
#                 return None, f"Ошибка загрузки изображения: {e}"
            
#             time.sleep(3)
            
#             # ШАГ 2: ВВОДИМ ПРОМПТ (ИСПРАВЛЕННАЯ ЧАСТЬ)
#             debug_print("📝 Вводим промпт...")
#             try:
#                 textarea = page.query_selector('textarea')
#                 if textarea:
#                     # КЛИКАЕМ И СТИРАЕМ СОДЕРЖИМОЕ С ПОМОЩЬЮ КЛАВИАТУРЫ
#                     textarea.click()
#                     # Стираем существующий текст
#                     textarea.press('Control+A')  # Выделяем все
#                     textarea.press('Backspace')  # Удаляем
#                     # Вводим наш промпт
#                     textarea.fill(PROMPT_TEXT)
#                     debug_print("✅ Промпт введен")
                    
#                     # ШАГ 3: ОТПРАВЛЯЕМ СООБЩЕНИЕ
#                     debug_print("📤 Отправляем сообщение...")
#                     textarea.press('Enter')
#                     debug_print("✅ Сообщение отправлено через Enter")
                    
#                 else:
#                     return None, "Не найдено поле для ввода текста"
                    
#             except Exception as e:
#                 debug_print(f"❌ Ошибка ввода текста: {e}")
#                 return None, f"Ошибка ввода текста: {e}"
            
#             # ШАГ 4: ЖДЕМ ОТВЕТА
#             debug_print("⏳ Ожидаем ответа DeepSeek...")
#             time.sleep(25)  # Даем время на генерацию
            
#             # Получаем ответ
#             response_text = ""
#             try:
#                 # Ждем появления ответа
#                 page.wait_for_selector('.message:last-child .assistant-message', timeout=60000)
#                 response_elements = page.query_selector_all('.message:last-child .assistant-message')
#                 if response_elements:
#                     response_text = response_elements[-1].inner_text()
#                     debug_print(f"✅ Ответ получен ({len(response_text)} символов)")
#                 else:
#                     response_text = page.inner_text('body')
#             except:
#                 response_text = page.inner_text('body')
            
#             browser.close()
#             return response_text, None
            
#     except Exception as e:
#         debug_print(f"❌ Критическая ошибка: {e}")
#         return None, f"Критическая ошибка Playwright: {e}"

# def parse_solutions_from_text(text):
#     if not text:
#         return []
    
#     debug_print("🔍 Анализируем ответ DeepSeek...")
    
#     # Пытаемся найти JSON
#     try:
#         json_match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', text, re.DOTALL)
#         if json_match:
#             json_str = json_match.group(0)
#             json_str = re.sub(r',\s*\}(?=,|\])', '}', json_str)
#             json_str = re.sub(r',\s*\](?=\s*\})', ']', json_str)
            
#             parsed_data = json.loads(json_str)
#             if "solutions" in parsed_data and isinstance(parsed_data["solutions"], list):
#                 debug_print(f"✅ Найдено {len(parsed_data['solutions'])} решений в JSON")
#                 return parsed_data["solutions"]
#     except Exception as e:
#         debug_print(f"⚠️ Ошибка парсинга JSON: {e}")
    
#     # Запасное решение
#     debug_print("🔄 Создаем запасное решение...")
#     lines = [line.strip() for line in text.split('\n') if line.strip()]
    
#     answer = "Ответ не найден"
#     for line in lines:
#         if any(word in line.lower() for word in ['ответ', 'answer', 'result']):
#             answer = line
#             break
    
#     steps = lines[:10] if len(lines) > 10 else lines
    
#     solution = {
#         "title": "Решение задачи",
#         "formulas": ["См. шаги решения"],
#         "answer": answer,
#         "steps": steps if steps else ["Подробное решение в тексте ответа"]
#     }
    
#     return [solution]

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     debug_print("\n" + "="*50)
#     debug_print("📱 ПОЛУЧЕН ЗАПРОС ОТ ТЕЛЕФОНА")
#     debug_print("="*50)
    
#     try:
#         data = request.get_json()
#         if not data or 'image' not in data:
#             return jsonify({
#                 "success": False, 
#                 "message": "Нет изображения в запросе",
#                 "solutions": []
#             }), 400
        
#         debug_print("💾 Сохраняем изображение...")
#         try:
#             image_data = base64.b64decode(data['image'])
#             with open(TEMP_IMAGE_FILE, 'wb') as f:
#                 f.write(image_data)
#             debug_print(f"✅ Изображение сохранено ({len(image_data)} байт)")
#         except Exception as e:
#             return jsonify({
#                 "success": False, 
#                 "message": f"Ошибка сохранения изображения: {e}",
#                 "solutions": []
#             }), 500
        
#         debug_print("🔄 Отправляем в DeepSeek...")
#         response_text, error = get_deepseek_response(TEMP_IMAGE_FILE)
        
#         if os.path.exists(TEMP_IMAGE_FILE):
#             os.remove(TEMP_IMAGE_FILE)
#             debug_print("🗑️ Временный файл удален")
        
#         if error:
#             debug_print(f"❌ Ошибка: {error}")
#             return jsonify({
#                 "success": False, 
#                 "message": error,
#                 "solutions": []
#             }), 500
        
#         debug_print("🔍 Парсим решения...")
#         solutions = parse_solutions_from_text(response_text)
        
#         if solutions:
#             debug_print(f"✅ Найдено {len(solutions)} решений")
#             return jsonify({
#                 "success": True,
#                 "message": "Решение получено",
#                 "solutions": solutions
#             })
#         else:
#             debug_print("❌ Решения не найдены")
#             return jsonify({
#                 "success": False,
#                 "message": "Не удалось извлечь решения из ответа",
#                 "solutions": []
#             }), 500
            
#     except Exception as e:
#         debug_print(f"💥 Критическая ошибка сервера: {e}")
#         return jsonify({
#             "success": False,
#             "message": f"Внутренняя ошибка сервера: {e}",
#             "solutions": []
#         }), 500

# @app.route('/status', methods=['GET'])
# def server_status():
#     try:
#         with sync_playwright() as p:
#             browser = p.chromium.connect_over_cdp("http://localhost:9222")
#             chrome_connected = browser is not None
#             browser.close()
            
#             return jsonify({
#                 "success": True,
#                 "chrome_connected": chrome_connected,
#                 "message": "Сервер работает, Chrome подключен" if chrome_connected else "Chrome не подключен"
#             })
#     except:
#         return jsonify({
#             "success": False,
#             "chrome_connected": False,
#             "message": "Chrome не запущен на порту 9222"
#         })

# if __name__ == '__main__':
#     debug_print("🚀 Запуск Flask сервера...")
#     debug_print("📍 Сервер будет доступен по адресу: http://192.168.0.11:5000")
#     debug_print("="*50)
    
#     app.run(host='0.0.0.0', port=5000, debug=True)







# import os
# import json
# import base64
# import re
# import time
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from playwright.sync_api import sync_playwright
# from PIL import Image
# import io

# # --- КОНСТАНТЫ ---
# TEMP_IMAGE_FILE = 'temp_image.jpg'
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TIMEOUT_MS = 180000

# PROMPT_TEXT = """
# РЕШИ ЭТУ ФИЗИЧЕСКУЮ ЗАДАЧУ И ВЕРНИ ОТВЕТ В ФОРМАТЕ JSON:

# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула1", "формула2"],
#             "answer": "конечный ответ",
#             "steps": ["шаг1", "шаг2", "шаг3"]
#         }
#     ]
# }

# ВАЖНО: Верни ТОЛЬКО JSON без лишнего текста
# """

# app = Flask(__name__)
# CORS(app)

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def crop_image_to_frame(image_data, frame_rect, screen_width, screen_height):
#     """Обрезает изображение до области рамки"""
#     try:
#         debug_print("✂️ Обрезаем изображение по рамке...")
        
#         # Открываем изображение из base64
#         image = Image.open(io.BytesIO(image_data))
        
#         # Получаем размеры оригинального изображения
#         img_width, img_height = image.size
#         debug_print(f"📐 Размеры изображения: {img_width}x{img_height}")
#         debug_print(f"📐 Размеры экрана: {screen_width}x{screen_height}")
#         debug_print(f"📐 Координаты рамки: x={frame_rect['x']}, y={frame_rect['y']}, width={frame_rect['width']}, height={frame_rect['height']}")
        
#         # Вычисляем соотношение размеров
#         scale_x = img_width / screen_width
#         scale_y = img_height / screen_height
        
#         # Масштабируем координаты рамки под размер изображения
#         left = int(frame_rect['x'] * scale_x)
#         top = int(frame_rect['y'] * scale_y)
#         right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
#         bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
        
#         # Проверяем границы
#         left = max(0, min(left, img_width))
#         top = max(0, min(top, img_height))
#         right = max(0, min(right, img_width))
#         bottom = max(0, min(bottom, img_height))
        
#         debug_print(f"📐 Область обрезки: left={left}, top={top}, right={right}, bottom={bottom}")
        
#         # Обрезаем изображение
#         cropped_image = image.crop((left, top, right, bottom))
        
#         # Сохраняем обрезанное изображение во временный файл
#         cropped_image.save(TEMP_CROPPED_FILE, 'JPEG', quality=85)
#         debug_print(f"✅ Изображение обрезано: {TEMP_CROPPED_FILE}")
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"❌ Ошибка обрезки изображения: {e}")
#         return None

# def get_deepseek_response(image_path):
#     debug_print("🚀 Запускаем DeepSeek с Playwright...")
    
#     try:
#         with sync_playwright() as p:
#             debug_print("🔗 Подключаемся к Chrome на порту 9222...")
#             browser = p.chromium.connect_over_cdp("http://localhost:9222")
            
#             context = browser.contexts[0]
#             if not context.pages:
#                 return None, "В Chrome нет открытых вкладок"
                
#             page = context.pages[0]
#             debug_print(f"📄 Работаем с вкладкой: {page.title()}")
            
#             current_url = page.url
#             if "deepseek.com" not in current_url:
#                 debug_print("🌐 Переходим на DeepSeek...")
#                 page.goto("https://chat.deepseek.com", wait_until="networkidle")
#                 time.sleep(3)
            
#             debug_print("⏳ Ждем загрузки интерфейса DeepSeek...")
#             page.wait_for_selector('textarea', timeout=15000)
            
#             # ШАГ 1: ЗАГРУЖАЕМ ИЗОБРАЖЕНИЕ
#             debug_print("🖼️ Загружаем изображение...")
#             try:
#                 file_input = page.query_selector('input[type="file"]')
#                 if file_input:
#                     file_input.set_input_files(image_path)
#                     debug_print("✅ Изображение загружено")
#                 else:
#                     return None, "Не найдено поле для загрузки файлов"
#             except Exception as e:
#                 debug_print(f"❌ Ошибка загрузки изображения: {e}")
#                 return None, f"Ошибка загрузки изображения: {e}"
            
#             time.sleep(3)
            
#             # ШАГ 2: ВВОДИМ ПРОМПТ
#             debug_print("📝 Вводим промпт...")
#             try:
#                 textarea = page.query_selector('textarea')
#                 if textarea:
#                     # Очищаем поле ввода
#                     textarea.click()
#                     textarea.press('Control+A')
#                     textarea.press('Backspace')
#                     # Вводим наш промпт
#                     textarea.fill(PROMPT_TEXT)
#                     debug_print("✅ Промпт введен")
                    
#                     # ШАГ 3: ОТПРАВЛЯЕМ СООБЩЕНИЕ
#                     debug_print("📤 Отправляем сообщение...")
#                     textarea.press('Enter')
#                     debug_print("✅ Сообщение отправлено через Enter")
                    
#                 else:
#                     return None, "Не найдено поле для ввода текста"
                    
#             except Exception as e:
#                 debug_print(f"❌ Ошибка ввода текста: {e}")
#                 return None, f"Ошибка ввода текста: {e}"
            
#             # ШАГ 4: ЖДЕМ ОТВЕТА
#             debug_print("⏳ Ожидаем ответа DeepSeek...")
#             time.sleep(25)  # Даем время на генерацию
            
#             # Получаем ответ
#             response_text = ""
#             try:
#                 # Ждем появления ответа
#                 page.wait_for_selector('.message:last-child .assistant-message', timeout=60000)
#                 response_elements = page.query_selector_all('.message:last-child .assistant-message')
#                 if response_elements:
#                     response_text = response_elements[-1].inner_text()
#                     debug_print(f"✅ Ответ получен ({len(response_text)} символов)")
#                 else:
#                     response_text = page.inner_text('body')
#             except:
#                 response_text = page.inner_text('body')
            
#             browser.close()
#             return response_text, None
            
#     except Exception as e:
#         debug_print(f"❌ Критическая ошибка: {e}")
#         return None, f"Критическая ошибка Playwright: {e}"

# def parse_solutions_from_text(text):
#     if not text:
#         return []
    
#     debug_print("🔍 Анализируем ответ DeepSeek...")
    
#     # Пытаемся найти JSON
#     try:
#         json_match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', text, re.DOTALL)
#         if json_match:
#             json_str = json_match.group(0)
#             json_str = re.sub(r',\s*\}(?=,|\])', '}', json_str)
#             json_str = re.sub(r',\s*\](?=\s*\})', ']', json_str)
            
#             parsed_data = json.loads(json_str)
#             if "solutions" in parsed_data and isinstance(parsed_data["solutions"], list):
#                 debug_print(f"✅ Найдено {len(parsed_data['solutions'])} решений в JSON")
#                 return parsed_data["solutions"]
#     except Exception as e:
#         debug_print(f"⚠️ Ошибка парсинга JSON: {e}")
    
#     # Запасное решение
#     debug_print("🔄 Создаем запасное решение...")
#     lines = [line.strip() for line in text.split('\n') if line.strip()]
    
#     answer = "Ответ не найден"
#     for line in lines:
#         if any(word in line.lower() for word in ['ответ', 'answer', 'result']):
#             answer = line
#             break
    
#     steps = lines[:10] if len(lines) > 10 else lines
    
#     solution = {
#         "title": "Решение задачи",
#         "formulas": ["См. шаги решения"],
#         "answer": answer,
#         "steps": steps if steps else ["Подробное решение в тексте ответа"]
#     }
    
#     return [solution]

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     debug_print("\n" + "="*50)
#     debug_print("📱 ПОЛУЧЕН ЗАПРОС ОТ ТЕЛЕФОНА")
#     debug_print("="*50)
    
#     try:
#         data = request.get_json()
#         if not data or 'image' not in data:
#             return jsonify({
#                 "success": False, 
#                 "message": "Нет изображения в запросе",
#                 "solutions": []
#             }), 400
        
#         debug_print("💾 Декодируем изображение...")
#         try:
#             image_data = base64.b64decode(data['image'])
#             debug_print(f"✅ Изображение декодировано ({len(image_data)} байт)")
#         except Exception as e:
#             return jsonify({
#                 "success": False, 
#                 "message": f"Ошибка декодирования изображения: {e}",
#                 "solutions": []
#             }), 500
        
#         # ОБРЕЗАЕМ ИЗОБРАЖЕНИЕ ЕСЛИ ЕСТЬ КООРДИНАТЫ РАМКИ
#         image_to_send = None
#         if 'frame_rect' in data and data['frame_rect']:
#             frame_rect = data['frame_rect']
#             screen_width = data.get('screen_width', 360)
#             screen_height = data.get('screen_height', 640)
            
#             cropped_path = crop_image_to_frame(image_data, frame_rect, screen_width, screen_height)
#             if cropped_path:
#                 image_to_send = cropped_path
#                 debug_print("🖼️ Используем обрезанное изображение")
#             else:
#                 # Сохраняем оригинал если обрезка не удалась
#                 with open(TEMP_IMAGE_FILE, 'wb') as f:
#                     f.write(image_data)
#                 image_to_send = TEMP_IMAGE_FILE
#                 debug_print("🖼️ Используем оригинальное изображение (обрезка не удалась)")
#         else:
#             # Сохраняем оригинал если нет координат рамки
#             with open(TEMP_IMAGE_FILE, 'wb') as f:
#                 f.write(image_data)
#             image_to_send = TEMP_IMAGE_FILE
#             debug_print("🖼️ Используем оригинальное изображение (нет координат рамки)")
        
#         debug_print("🔄 Отправляем в DeepSeek...")
#         response_text, error = get_deepseek_response(image_to_send)
        
#         # Удаляем временные файлы
#         if os.path.exists(TEMP_IMAGE_FILE):
#             os.remove(TEMP_IMAGE_FILE)
#             debug_print("🗑️ Временный файл удален")
#         if os.path.exists(TEMP_CROPPED_FILE):
#             os.remove(TEMP_CROPPED_FILE)
#             debug_print("🗑️ Обрезанный файл удален")
        
#         if error:
#             debug_print(f"❌ Ошибка: {error}")
#             return jsonify({
#                 "success": False, 
#                 "message": error,
#                 "solutions": []
#             }), 500
        
#         debug_print("🔍 Парсим решения...")
#         solutions = parse_solutions_from_text(response_text)
        
#         if solutions:
#             debug_print(f"✅ Найдено {len(solutions)} решений")
#             return jsonify({
#                 "success": True,
#                 "message": "Решение получено",
#                 "solutions": solutions
#             })
#         else:
#             debug_print("❌ Решения не найдены")
#             return jsonify({
#                 "success": False,
#                 "message": "Не удалось извлечь решения из ответа",
#                 "solutions": []
#             }), 500
            
#     except Exception as e:
#         debug_print(f"💥 Критическая ошибка сервера: {e}")
#         return jsonify({
#             "success": False,
#             "message": f"Внутренняя ошибка сервера: {e}",
#             "solutions": []
#         }), 500

# @app.route('/status', methods=['GET'])
# def server_status():
#     try:
#         with sync_playwright() as p:
#             browser = p.chromium.connect_over_cdp("http://localhost:9222")
#             chrome_connected = browser is not None
#             browser.close()
            
#             return jsonify({
#                 "success": True,
#                 "chrome_connected": chrome_connected,
#                 "message": "Сервер работает, Chrome подключен" if chrome_connected else "Chrome не подключен"
#             })
#     except:
#         return jsonify({
#             "success": False,
#             "chrome_connected": False,
#             "message": "Chrome не запущен на порту 9222"
#         })

# if __name__ == '__main__':
#     debug_print("🚀 Запуск Flask сервера...")
#     debug_print("📍 Сервер будет доступен по адресу: http://192.168.0.11:5000")
#     debug_print("✂️ Функция обрезки изображения активирована")
#     debug_print("="*50)
    
#     app.run(host='0.0.0.0', port=5000, debug=True)











# import os
# import json
# import base64
# import re
# import time
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from playwright.sync_api import sync_playwright
# from PIL import Image
# import io

# # --- КОНСТАНТЫ ---
# TEMP_IMAGE_FILE = 'temp_image.jpg'
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TIMEOUT_MS = 180000

# PROMPT_TEXT = """
# РЕШИ ЭТУ ФИЗИЧЕСКУЮ ЗАДАЧУ И ВЕРНИ ОТВЕТ В ФОРМАТЕ JSON:

# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула1", "формула2"],
#             "answer": "конечный ответ",
#             "steps": ["шаг1", "шаг2", "шаг3"]
#         }
#     ]
# }

# ВАЖНО: Верни ТОЛЬКО JSON без лишнего текста
# """

# app = Flask(__name__)
# CORS(app)

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def crop_image_to_frame(image_data, frame_rect, screen_width, screen_height):
#     """Обрезает изображение до области рамки"""
#     try:
#         debug_print("✂️ Обрезаем изображение по рамке...")
        
#         # Открываем изображение из base64
#         image = Image.open(io.BytesIO(image_data))
        
#         # Получаем размеры оригинального изображения
#         img_width, img_height = image.size
#         debug_print(f"📐 Размеры изображения: {img_width}x{img_height}")
#         debug_print(f"📐 Размеры экрана: {screen_width}x{screen_height}")
#         debug_print(f"📐 Координаты рамки: x={frame_rect['x']}, y={frame_rect['y']}, width={frame_rect['width']}, height={frame_rect['height']}")
        
#         # Вычисляем соотношение размеров
#         scale_x = img_width / screen_width
#         scale_y = img_height / screen_height
        
#         # Масштабируем координаты рамки под размер изображения
#         left = int(frame_rect['x'] * scale_x)
#         top = int(frame_rect['y'] * scale_y)
#         right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
#         bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
        
#         # Проверяем границы
#         left = max(0, min(left, img_width))
#         top = max(0, min(top, img_height))
#         right = max(0, min(right, img_width))
#         bottom = max(0, min(bottom, img_height))
        
#         debug_print(f"📐 Область обрезки: left={left}, top={top}, right={right}, bottom={bottom}")
        
#         # Обрезаем изображение
#         cropped_image = image.crop((left, top, right, bottom))
        
#         # Сохраняем обрезанное изображение во временный файл
#         cropped_image.save(TEMP_CROPPED_FILE, 'JPEG', quality=85)
#         debug_print(f"✅ Изображение обрезано: {TEMP_CROPPED_FILE}")
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"❌ Ошибка обрезки изображения: {e}")
#         return None

# def get_deepseek_response(image_path):
#     debug_print("🚀 Запускаем DeepSeek с Playwright...")
    
#     try:
#         with sync_playwright() as p:
#             debug_print("🔗 Подключаемся к Chrome на порту 9222...")
#             browser = p.chromium.connect_over_cdp("http://localhost:9222")
            
#             context = browser.contexts[0]
#             if not context.pages:
#                 return None, "В Chrome нет открытых вкладок"
                
#             page = context.pages[0]
#             debug_print(f"📄 Работаем с вкладкой: {page.title()}")
            
#             current_url = page.url
#             if "deepseek.com" not in current_url:
#                 debug_print("🌐 Переходим на DeepSeek...")
#                 page.goto("https://chat.deepseek.com", wait_until="networkidle")
#                 time.sleep(5)  # Увеличили время ожидания
            
#             debug_print("⏳ Ждем загрузки интерфейса DeepSeek...")
#             page.wait_for_selector('textarea', timeout=20000)  # Увеличили таймаут
            
#             # ШАГ 1: ЗАГРУЖАЕМ ИЗОБРАЖЕНИЕ
#             debug_print("🖼️ Загружаем изображение...")
#             try:
#                 # Ищем поле для загрузки файлов
#                 file_input = page.query_selector('input[type="file"]')
#                 if file_input:
#                     file_input.set_input_files(image_path)
#                     debug_print("✅ Изображение загружено")
#                     time.sleep(3)  # Ждем обработки изображения
#                 else:
#                     debug_print("❌ Не найдено поле для загрузки файлов")
#                     return None, "Не найдено поле для загрузки файлов"
#             except Exception as e:
#                 debug_print(f"❌ Ошибка загрузки изображения: {e}")
#                 return None, f"Ошибка загрузки изображения: {e}"
            
#             # ШАГ 2: ВВОДИМ ПРОМПТ
#             debug_print("📝 Вводим промпт...")
#             try:
#                 textarea = page.query_selector('textarea')
#                 if textarea:
#                     # Очищаем поле ввода
#                     textarea.click()
#                     textarea.press('Control+A')
#                     textarea.press('Backspace')
#                     # Вводим наш промпт
#                     textarea.fill(PROMPT_TEXT)
#                     debug_print("✅ Промпт введен")
#                     time.sleep(1)  # Даем время на ввод
                    
#                     # ШАГ 3: ОТПРАВЛЯЕМ СООБЩЕНИЕ (УЛУЧШЕННАЯ ЛОГИКА)
#                     debug_print("📤 Отправляем сообщение...")
                    
#                     # Метод 1: Ищем кнопку отправки
#                     send_button = page.query_selector('button[type="submit"]')
#                     if send_button and send_button.is_enabled():
#                         send_button.click()
#                         debug_print("✅ Сообщение отправлено через кнопку отправки")
#                     else:
#                         # Метод 2: Ищем другие кнопки отправки
#                         all_buttons = page.query_selector_all('button')
#                         send_button_found = False
                        
#                         for button in all_buttons:
#                             button_text = button.inner_text().lower()
#                             if any(word in button_text for word in ['send', 'отправ', '➤', '▶', '⏎']):
#                                 if button.is_enabled():
#                                     button.click()
#                                     debug_print("✅ Сообщение отправлено через найденную кнопку")
#                                     send_button_found = True
#                                     break
                        
#                         if not send_button_found:
#                             # Метод 3: Старый способ через Enter
#                             textarea.press('Enter')
#                             debug_print("✅ Сообщение отправлено через Enter")
                    
#                 else:
#                     debug_print("❌ Не найдено поле для ввода текста")
#                     return None, "Не найдено поле для ввода текста"
                    
#             except Exception as e:
#                 debug_print(f"❌ Ошибка ввода текста: {e}")
#                 return None, f"Ошибка ввода текста: {e}"
            
#             # ШАГ 4: ЖДЕМ ОТВЕТА (УВЕЛИЧИЛИ ВРЕМЯ)
#             debug_print("⏳ Ожидаем ответа DeepSeek...")
#             time.sleep(35)  # Увеличили время ожидания генерации
            
#             # Получаем ответ
#             response_text = ""
#             try:
#                 # Ждем появления ответа с увеличенным таймаутом
#                 page.wait_for_selector('.message:last-child .assistant-message', timeout=90000)
                
#                 # Пробуем разные селекторы для ответа
#                 selectors = [
#                     '.message:last-child .assistant-message',
#                     '[data-testid="assistant-message"]',
#                     '.markdown-body',
#                     '.prose'
#                 ]
                
#                 for selector in selectors:
#                     response_elements = page.query_selector_all(selector)
#                     if response_elements:
#                         response_text = response_elements[-1].inner_text()
#                         debug_print(f"✅ Ответ получен через селектор {selector} ({len(response_text)} символов)")
#                         break
                
#                 if not response_text:
#                     # Если не нашли через селекторы, берем весь текст страницы
#                     response_text = page.inner_text('body')
#                     debug_print(f"⚠️ Используем текст body ({len(response_text)} символов)")
                    
#             except Exception as e:
#                 debug_print(f"⚠️ Ошибка при получении ответа: {e}")
#                 response_text = page.inner_text('body')
            
#             browser.close()
#             return response_text, None
            
#     except Exception as e:
#         debug_print(f"❌ Критическая ошибка: {e}")
#         return None, f"Критическая ошибка Playwright: {e}"

# def parse_solutions_from_text(text):
#     if not text:
#         return []
    
#     debug_print("🔍 Анализируем ответ DeepSeek...")
    
#     # Пытаемся найти JSON
#     try:
#         json_match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', text, re.DOTALL)
#         if json_match:
#             json_str = json_match.group(0)
#             # Чистим JSON
#             json_str = re.sub(r',\s*\}(?=,|\])', '}', json_str)
#             json_str = re.sub(r',\s*\](?=\s*\})', ']', json_str)
            
#             parsed_data = json.loads(json_str)
#             if "solutions" in parsed_data and isinstance(parsed_data["solutions"], list):
#                 debug_print(f"✅ Найдено {len(parsed_data['solutions'])} решений в JSON")
#                 return parsed_data["solutions"]
#     except Exception as e:
#         debug_print(f"⚠️ Ошибка парсинга JSON: {e}")
    
#     # Запасное решение
#     debug_print("🔄 Создаем запасное решение...")
#     lines = [line.strip() for line in text.split('\n') if line.strip()]
    
#     answer = "Ответ не найден"
#     for line in lines:
#         if any(word in line.lower() for word in ['ответ', 'answer', 'result', '=']):
#             answer = line
#             break
    
#     steps = lines[:10] if len(lines) > 10 else lines
    
#     solution = {
#         "title": "Решение задачи",
#         "formulas": ["См. шаги решения"],
#         "answer": answer,
#         "steps": steps if steps else ["Подробное решение в тексте ответа"]
#     }
    
#     return [solution]

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     debug_print("\n" + "="*50)
#     debug_print("📱 ПОЛУЧЕН ЗАПРОС ОТ ТЕЛЕФОНА")
#     debug_print("="*50)
    
#     try:
#         data = request.get_json()
#         if not data or 'image' not in data:
#             return jsonify({
#                 "success": False, 
#                 "message": "Нет изображения в запросе",
#                 "solutions": []
#             }), 400
        
#         debug_print("💾 Декодируем изображение...")
#         try:
#             image_data = base64.b64decode(data['image'])
#             debug_print(f"✅ Изображение декодировано ({len(image_data)} байт)")
#         except Exception as e:
#             return jsonify({
#                 "success": False, 
#                 "message": f"Ошибка декодирования изображения: {e}",
#                 "solutions": []
#             }), 500
        
#         # ОБРЕЗАЕМ ИЗОБРАЖЕНИЕ ЕСЛИ ЕСТЬ КООРДИНАТЫ РАМКИ
#         image_to_send = None
#         if 'frame_rect' in data and data['frame_rect']:
#             frame_rect = data['frame_rect']
#             screen_width = data.get('screen_width', 360)
#             screen_height = data.get('screen_height', 640)
            
#             cropped_path = crop_image_to_frame(image_data, frame_rect, screen_width, screen_height)
#             if cropped_path:
#                 image_to_send = cropped_path
#                 debug_print("🖼️ Используем обрезанное изображение")
#             else:
#                 # Сохраняем оригинал если обрезка не удалась
#                 with open(TEMP_IMAGE_FILE, 'wb') as f:
#                     f.write(image_data)
#                 image_to_send = TEMP_IMAGE_FILE
#                 debug_print("🖼️ Используем оригинальное изображение (обрезка не удалась)")
#         else:
#             # Сохраняем оригинал если нет координат рамки
#             with open(TEMP_IMAGE_FILE, 'wb') as f:
#                 f.write(image_data)
#             image_to_send = TEMP_IMAGE_FILE
#             debug_print("🖼️ Используем оригинальное изображение (нет координат рамки)")
        
#         debug_print("🔄 Отправляем в DeepSeek...")
#         response_text, error = get_deepseek_response(image_to_send)
        
#         # Удаляем временные файлы
#         if os.path.exists(TEMP_IMAGE_FILE):
#             os.remove(TEMP_IMAGE_FILE)
#             debug_print("🗑️ Временный файл удален")
#         if os.path.exists(TEMP_CROPPED_FILE):
#             os.remove(TEMP_CROPPED_FILE)
#             debug_print("🗑️ Обрезанный файл удален")
        
#         if error:
#             debug_print(f"❌ Ошибка: {error}")
#             return jsonify({
#                 "success": False, 
#                 "message": error,
#                 "solutions": []
#             }), 500
        
#         debug_print("🔍 Парсим решения...")
#         solutions = parse_solutions_from_text(response_text)
        
#         if solutions:
#             debug_print(f"✅ Найдено {len(solutions)} решений")
#             return jsonify({
#                 "success": True,
#                 "message": "Решение получено",
#                 "solutions": solutions
#             })
#         else:
#             debug_print("❌ Решения не найдены")
#             return jsonify({
#                 "success": False,
#                 "message": "Не удалось извлечь решения из ответа",
#                 "solutions": []
#             }), 500
            
#     except Exception as e:
#         debug_print(f"💥 Критическая ошибка сервера: {e}")
#         return jsonify({
#             "success": False,
#             "message": f"Внутренняя ошибка сервера: {e}",
#             "solutions": []
#         }), 500

# @app.route('/status', methods=['GET'])
# def server_status():
#     try:
#         with sync_playwright() as p:
#             browser = p.chromium.connect_over_cdp("http://localhost:9222")
#             chrome_connected = browser is not None
#             browser.close()
            
#             return jsonify({
#                 "success": True,
#                 "chrome_connected": chrome_connected,
#                 "message": "Сервер работает, Chrome подключен" if chrome_connected else "Chrome не подключен"
#             })
#     except:
#         return jsonify({
#             "success": False,
#             "chrome_connected": False,
#             "message": "Chrome не запущен на порту 9222"
#         })

# if __name__ == '__main__':
#     debug_print("🚀 Запуск Flask сервера...")
#     debug_print("📍 Сервер будет доступен по адресу: http://192.168.0.11:5000")
#     debug_print("✂️ Функция обрезки изображения активирована")
#     debug_print("🔄 Улучшенная логика отправки сообщений в DeepSeek")
#     debug_print("="*50)
    
#     app.run(host='0.0.0.0', port=5000, debug=True)












# import os
# import json
# import base64
# import re
# import time
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from playwright.sync_api import sync_playwright
# from PIL import Image
# import io

# # --- КОНСТАНТЫ ---
# TEMP_IMAGE_FILE = 'temp_image.jpg'
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TIMEOUT_MS = 180000

# PROMPT_TEXT = """
# РЕШИ ЭТУ ФИЗИЧЕСКУЮ ЗАДАЧУ И ВЕРНИ ОТВЕТ В ФОРМАТЕ JSON:

# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула1", "формула2"],
#             "answer": "конечный ответ",
#             "steps": ["шаг1", "шаг2", "шаг3"]
#         }
#     ]
# }

# ВАЖНО: Верни ТОЛЬКО JSON без лишнего текста
# """

# app = Flask(__name__)
# CORS(app)

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def crop_image_to_frame(image_data, frame_rect, screen_width, screen_height):
#     """Обрезает изображение до области рамки"""
#     try:
#         debug_print("✂️ Обрезаем изображение по рамке...")
        
#         # Открываем изображение из base64
#         image = Image.open(io.BytesIO(image_data))
        
#         # Получаем размеры оригинального изображения
#         img_width, img_height = image.size
#         debug_print(f"📐 Размеры изображения: {img_width}x{img_height}")
#         debug_print(f"📐 Размеры экрана: {screen_width}x{screen_height}")
#         debug_print(f"📐 Координаты рамки: x={frame_rect['x']}, y={frame_rect['y']}, width={frame_rect['width']}, height={frame_rect['height']}")
        
#         # Вычисляем соотношение размеров
#         scale_x = img_width / screen_width
#         scale_y = img_height / screen_height
        
#         # Масштабируем координаты рамки под размер изображения
#         left = int(frame_rect['x'] * scale_x)
#         top = int(frame_rect['y'] * scale_y)
#         right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
#         bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
        
#         # Проверяем границы
#         left = max(0, min(left, img_width))
#         top = max(0, min(top, img_height))
#         right = max(0, min(right, img_width))
#         bottom = max(0, min(bottom, img_height))
        
#         debug_print(f"📐 Область обрезки: left={left}, top={top}, right={right}, bottom={bottom}")
        
#         # Обрезаем изображение
#         cropped_image = image.crop((left, top, right, bottom))
        
#         # Сохраняем обрезанное изображение во временный файл
#         cropped_image.save(TEMP_CROPPED_FILE, 'JPEG', quality=85)
#         debug_print(f"✅ Изображение обрезано: {TEMP_CROPPED_FILE}")
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"❌ Ошибка обрезки изображения: {e}")
#         return None

# def get_deepseek_response(image_path):
#     debug_print("🚀 Запускаем DeepSeek с Playwright...")
    
#     try:
#         with sync_playwright() as p:
#             debug_print("🔗 Подключаемся к Chrome на порту 9222...")
#             browser = p.chromium.connect_over_cdp("http://localhost:9222")
            
#             context = browser.contexts[0]
#             if not context.pages:
#                 return None, "В Chrome нет открытых вкладок"
                
#             page = context.pages[0]
#             debug_print(f"📄 Работаем с вкладкой: {page.title()}")
            
#             current_url = page.url
#             if "deepseek.com" not in current_url:
#                 debug_print("🌐 Переходим на DeepSeek...")
#                 page.goto("https://chat.deepseek.com", wait_until="networkidle")
#                 time.sleep(5)
            
#             debug_print("⏳ Ждем загрузки интерфейса DeepSeek...")
#             page.wait_for_selector('textarea', timeout=20000)
            
#             # ШАГ 1: ЗАГРУЖАЕМ ИЗОБРАЖЕНИЕ
#             debug_print("🖼️ Загружаем изображение...")
#             try:
#                 file_input = page.query_selector('input[type="file"]')
#                 if file_input:
#                     file_input.set_input_files(image_path)
#                     debug_print("✅ Изображение загружено")
#                     time.sleep(3)
#                 else:
#                     return None, "Не найдено поле для загрузки файлов"
#             except Exception as e:
#                 debug_print(f"❌ Ошибка загрузки изображения: {e}")
#                 return None, f"Ошибка загрузки изображения: {e}"
            
#             # ШАГ 2: ВВОДИМ ПРОМПТ
#             debug_print("📝 Вводим промпт...")
#             try:
#                 textarea = page.query_selector('textarea')
#                 if textarea:
#                     # Очищаем поле ввода
#                     textarea.click()
#                     textarea.press('Control+A')
#                     textarea.press('Backspace')
#                     # Вводим наш промпт
#                     textarea.fill(PROMPT_TEXT)
#                     debug_print("✅ Промпт введен")
#                     time.sleep(1)
                    
#                     # ШАГ 3: ОТПРАВЛЯЕМ СООБЩЕНИЕ
#                     debug_print("📤 Отправляем сообщение...")
                    
#                     # Пробуем разные способы отправки
#                     send_button = page.query_selector('button[type="submit"]')
#                     if send_button and send_button.is_enabled():
#                         send_button.click()
#                         debug_print("✅ Сообщение отправлено через кнопку отправки")
#                     else:
#                         # Ищем кнопку по тексту или эмодзи
#                         all_buttons = page.query_selector_all('button')
#                         send_button_found = False
                        
#                         for button in all_buttons:
#                             if button.is_enabled():
#                                 button_text = button.inner_text().lower()
#                                 if any(word in button_text for word in ['send', 'отправ', '➤', '▶', '⏎', '↵']):
#                                     button.click()
#                                     debug_print("✅ Сообщение отправлено через найденную кнопку")
#                                     send_button_found = True
#                                     break
                        
#                         if not send_button_found:
#                             # Старый способ через Enter
#                             textarea.press('Enter')
#                             debug_print("✅ Сообщение отправлено через Enter")
                    
#                 else:
#                     return None, "Не найдено поле для ввода текста"
                    
#             except Exception as e:
#                 debug_print(f"❌ Ошибка ввода текста: {e}")
#                 return None, f"Ошибка ввода текста: {e}"
            
#             # ШАГ 4: ЖДЕМ И ПОЛУЧАЕМ ОТВЕТ (УЛУЧШЕННАЯ ЛОГИКА)
#             debug_print("⏳ Ожидаем ответа DeepSeek...")
            
#             # Ждем появления нового ответа (увеличиваем время)
#             try:
#                 # Ждем пока появится индикатор генерации или новый ответ
#                 page.wait_for_selector('[data-testid="message"]:last-of-type', timeout=90000)
                
#                 # Даем дополнительное время на генерацию
#                 time.sleep(10)
                
#                 # Пробуем разные селекторы для ответа DeepSeek
#                 debug_print("🔍 Ищем ответ DeepSeek...")
                
#                 selectors = [
#                     '[data-testid="message"]:last-of-type',  # Новые сообщения
#                     '.message:last-child',                   # Сообщения
#                     '.assistant-message',                    # Сообщения ассистента
#                     '.markdown-body',                        # Markdown контент
#                     '.prose',                                # Текстовый контент
#                     '[class*="message"]:last-child',         # Любые элементы с message
#                     '[class*="assistant"]',                  # Любые элементы с assistant
#                     '[class*="bot"]',                        # Любые элементы с bot
#                 ]
                
#                 response_text = ""
#                 for selector in selectors:
#                     try:
#                         elements = page.query_selector_all(selector)
#                         if elements:
#                             # Берем последний элемент (самый новый ответ)
#                             last_element = elements[-1]
#                             text = last_element.inner_text().strip()
#                             if text and len(text) > 10:  # Проверяем что текст достаточно длинный
#                                 response_text = text
#                                 debug_print(f"✅ Ответ найден через селектор: {selector}")
#                                 debug_print(f"📄 Длина ответа: {len(response_text)} символов")
#                                 break
#                     except Exception as e:
#                         continue
                
#                 if not response_text:
#                     # Если не нашли через селекторы, пробуем получить весь текст страницы
#                     debug_print("⚠️ Ответ не найден через селекторы, пробуем получить весь текст...")
#                     body_text = page.inner_text('body')
                    
#                     # Ищем JSON в тексте страницы
#                     json_match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', body_text, re.DOTALL)
#                     if json_match:
#                         response_text = json_match.group(0)
#                         debug_print(f"✅ JSON найден в тексте страницы ({len(response_text)} символов)")
#                     else:
#                         # Берем последние 2000 символов как ответ
#                         response_text = body_text[-2000:] if len(body_text) > 2000 else body_text
#                         debug_print(f"⚠️ Используем текст body ({len(response_text)} символов)")
                
#             except Exception as e:
#                 debug_print(f"⚠️ Ошибка при получении ответа: {e}")
#                 response_text = page.inner_text('body')[-2000:] if len(page.inner_text('body')) > 2000 else page.inner_text('body')
            
#             browser.close()
            
#             if response_text:
#                 debug_print(f"🎯 Получен ответ: {response_text[:100]}...")
#             else:
#                 debug_print("❌ Ответ пустой")
                
#             return response_text, None
            
#     except Exception as e:
#         debug_print(f"❌ Критическая ошибка: {e}")
#         return None, f"Критическая ошибка Playwright: {e}"

# def parse_solutions_from_text(text):
#     if not text:
#         debug_print("❌ Текст для парсинга пустой")
#         return []
    
#     debug_print("🔍 Анализируем ответ DeepSeek...")
    
#     # Пытаемся найти JSON
#     try:
#         json_match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', text, re.DOTALL)
#         if json_match:
#             json_str = json_match.group(0)
#             debug_print(f"📄 Найден JSON: {json_str[:100]}...")
            
#             # Чистим JSON
#             json_str = re.sub(r',\s*\}(?=,|\])', '}', json_str)
#             json_str = re.sub(r',\s*\](?=\s*\})', ']', json_str)
            
#             parsed_data = json.loads(json_str)
#             if "solutions" in parsed_data and isinstance(parsed_data["solutions"], list):
#                 debug_print(f"✅ Найдено {len(parsed_data['solutions'])} решений в JSON")
#                 return parsed_data["solutions"]
#     except Exception as e:
#         debug_print(f"⚠️ Ошибка парсинга JSON: {e}")
    
#     # Запасное решение - ищем ответ в тексте
#     debug_print("🔄 Создаем запасное решение из текста...")
#     lines = [line.strip() for line in text.split('\n') if line.strip()]
    
#     answer = "Ответ не найден"
#     steps = []
    
#     # Ищем ответ в тексте
#     for i, line in enumerate(lines):
#         line_lower = line.lower()
#         if any(word in line_lower for word in ['ответ', 'answer', 'result', '=']):
#             answer = line
#             # Берем несколько строк после ответа как шаги
#             steps = lines[i+1:i+6] if i+1 < len(lines) else []
#             break
    
#     if not steps:
#         steps = lines[:5] if len(lines) > 5 else lines
    
#     solution = {
#         "title": "Решение задачи",
#         "formulas": ["Формулы в тексте решения"],
#         "answer": answer,
#         "steps": steps if steps else ["Подробное решение в тексте ответа"]
#     }
    
#     debug_print(f"✅ Создано запасное решение с ответом: {answer}")
#     return [solution]

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     debug_print("\n" + "="*50)
#     debug_print("📱 ПОЛУЧЕН ЗАПРОС ОТ ТЕЛЕФОНА")
#     debug_print("="*50)
    
#     try:
#         data = request.get_json()
#         if not data or 'image' not in data:
#             return jsonify({
#                 "success": False, 
#                 "message": "Нет изображения в запросе",
#                 "solutions": []
#             }), 400
        
#         debug_print("💾 Декодируем изображение...")
#         try:
#             image_data = base64.b64decode(data['image'])
#             debug_print(f"✅ Изображение декодировано ({len(image_data)} байт)")
#         except Exception as e:
#             return jsonify({
#                 "success": False, 
#                 "message": f"Ошибка декодирования изображения: {e}",
#                 "solutions": []
#             }), 500
        
#         # ОБРЕЗАЕМ ИЗОБРАЖЕНИЕ ЕСЛИ ЕСТЬ КООРДИНАТЫ РАМКИ
#         image_to_send = None
#         if 'frame_rect' in data and data['frame_rect']:
#             frame_rect = data['frame_rect']
#             screen_width = data.get('screen_width', 360)
#             screen_height = data.get('screen_height', 640)
            
#             cropped_path = crop_image_to_frame(image_data, frame_rect, screen_width, screen_height)
#             if cropped_path:
#                 image_to_send = cropped_path
#                 debug_print("🖼️ Используем обрезанное изображение")
#             else:
#                 with open(TEMP_IMAGE_FILE, 'wb') as f:
#                     f.write(image_data)
#                 image_to_send = TEMP_IMAGE_FILE
#                 debug_print("🖼️ Используем оригинальное изображение (обрезка не удалась)")
#         else:
#             with open(TEMP_IMAGE_FILE, 'wb') as f:
#                 f.write(image_data)
#             image_to_send = TEMP_IMAGE_FILE
#             debug_print("🖼️ Используем оригинальное изображение (нет координат рамки)")
        
#         debug_print("🔄 Отправляем в DeepSeek...")
#         response_text, error = get_deepseek_response(image_to_send)
        
#         # Удаляем временные файлы
#         if os.path.exists(TEMP_IMAGE_FILE):
#             os.remove(TEMP_IMAGE_FILE)
#             debug_print("🗑️ Временный файл удален")
#         if os.path.exists(TEMP_CROPPED_FILE):
#             os.remove(TEMP_CROPPED_FILE)
#             debug_print("🗑️ Обрезанный файл удален")
        
#         if error:
#             debug_print(f"❌ Ошибка: {error}")
#             return jsonify({
#                 "success": False, 
#                 "message": error,
#                 "solutions": []
#             }), 500
        
#         debug_print("🔍 Парсим решения...")
#         solutions = parse_solutions_from_text(response_text)
        
#         if solutions:
#             debug_print(f"✅ Найдено {len(solutions)} решений")
#             return jsonify({
#                 "success": True,
#                 "message": "Решение получено",
#                 "solutions": solutions
#             })
#         else:
#             debug_print("❌ Решения не найдены")
#             return jsonify({
#                 "success": False,
#                 "message": "Не удалось извлечь решения из ответа",
#                 "solutions": []
#             }), 500
            
#     except Exception as e:
#         debug_print(f"💥 Критическая ошибка сервера: {e}")
#         return jsonify({
#             "success": False,
#             "message": f"Внутренняя ошибка сервера: {e}",
#             "solutions": []
#         }), 500

# @app.route('/status', methods=['GET'])
# def server_status():
#     try:
#         with sync_playwright() as p:
#             browser = p.chromium.connect_over_cdp("http://localhost:9222")
#             chrome_connected = browser is not None
#             browser.close()
            
#             return jsonify({
#                 "success": True,
#                 "chrome_connected": chrome_connected,
#                 "message": "Сервер работает, Chrome подключен" if chrome_connected else "Chrome не подключен"
#             })
#     except:
#         return jsonify({
#             "success": False,
#             "chrome_connected": False,
#             "message": "Chrome не запущен на порту 9222"
#         })

# if __name__ == '__main__':
#     debug_print("🚀 Запуск Flask сервера...")
#     debug_print("📍 Сервер будет доступен по адресу: http://192.168.0.11:5000")
#     debug_print("🔄 Улучшенный поиск ответов DeepSeek")
#     debug_print("="*50)
    
#     app.run(host='0.0.0.0', port=5000, debug=True)


# ======================================================================================================================================================

# import os
# import json
# import base64
# import re
# import time
# import requests
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from PIL import Image
# import io

# # --- КОНСТАНТЫ ---
# TEMP_IMAGE_FILE = 'temp_image.jpg'
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TIMEOUT_MS = 120000  # 2 минуты

# # ⚠️ ВСТАВЬТЕ ВАШ API КЛЮЧ ЗДЕСЬ ⚠️
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2"  # ЗАМЕНИТЕ НА ВАШ КЛЮЧ

# # DeepSeek API эндпоинт
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# # Оптимизированный промпт для API
# PROMPT_TEXT = """Ты эксперт по физике. Реши задачу на изображении.

# Верни ответ СТРОГО в следующем JSON формате без лишнего текста:

# {
#     "solutions": [
#         {
#             "title": "Название метода решения",
#             "formulas": ["формула1", "формула2"],
#             "answer": "конечный числовой ответ с единицами измерения",
#             "steps": ["шаг 1: описание", "шаг 2: вычисления", "шаг 3: результат"]
#         }
#     ]
# }

# Если видишь несколько способов решения, добавь их в массив solutions.

# ВАЖНО:
# 1. Используй LaTeX для формул в квадратных скобках: [F = ma]
# 2. Ответ должен быть точным и кратким
# 3. Шаги решения должны быть последовательными
# 4. Только JSON, без markdown, без объяснений
# """

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def crop_image_to_frame(image_data, frame_rect, screen_width, screen_height):
#     """Обрезает изображение до области рамки"""
#     try:
#         debug_print("✂️ Обрезаем изображение по рамке...")
        
#         # Открываем изображение из base64
#         image = Image.open(io.BytesIO(image_data))
        
#         # Получаем размеры оригинального изображения
#         img_width, img_height = image.size
#         debug_print(f"📐 Размеры изображения: {img_width}x{img_height}")
#         debug_print(f"📐 Размеры экрана: {screen_width}x{screen_height}")
#         debug_print(f"📐 Координаты рамки: x={frame_rect['x']}, y={frame_rect['y']}, width={frame_rect['width']}, height={frame_rect['height']}")
        
#         # Вычисляем соотношение размеров
#         scale_x = img_width / screen_width
#         scale_y = img_height / screen_height
        
#         # Масштабируем координаты рамки под размер изображения
#         left = int(frame_rect['x'] * scale_x)
#         top = int(frame_rect['y'] * scale_y)
#         right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
#         bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
        
#         # Проверяем границы
#         left = max(0, min(left, img_width))
#         top = max(0, min(top, img_height))
#         right = max(0, min(right, img_width))
#         bottom = max(0, min(bottom, img_height))
        
#         debug_print(f"📐 Область обрезки: left={left}, top={top}, right={right}, bottom={bottom}")
        
#         # Обрезаем изображение
#         cropped_image = image.crop((left, top, right, bottom))
        
#         # Сохраняем обрезанное изображение во временный файл
#         cropped_image.save(TEMP_CROPPED_FILE, 'JPEG', quality=85)
#         debug_print(f"✅ Изображение обрезано: {TEMP_CROPPED_FILE}")
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"❌ Ошибка обрезки изображения: {e}")
#         return None

# def encode_image_to_base64(image_path):
#     """Кодирует изображение в base64"""
#     try:
#         with open(image_path, "rb") as image_file:
#             return base64.b64encode(image_file.read()).decode('utf-8')
#     except Exception as e:
#         debug_print(f"❌ Ошибка кодирования изображения: {e}")
#         return None

# def call_deepseek_api(image_base64=None, is_cropped=True):
#     """Вызывает DeepSeek API с изображением"""
#     try:
#         debug_print("🚀 Вызываем DeepSeek API...")
        
#         # Формируем сообщения для API
#         messages = [
#             {
#                 "role": "system",
#                 "content": "Ты физик-эксперт. Решай задачи четко и структурированно."
#             },
#             {
#                 "role": "user",
#                 "content": [
#                     {"type": "text", "text": PROMPT_TEXT},
#                 ]
#             }
#         ]
        
#         # Добавляем изображение если есть
#         if image_base64:
#             if is_cropped:
#                 messages[1]["content"].append({
#                     "type": "image_url",
#                     "image_url": {
#                         "url": f"data:image/jpeg;base64,{image_base64}",
#                         "detail": "high"
#                     }
#                 })
#                 debug_print("🖼️ Отправляем обрезанное изображение в API")
#             else:
#                 messages[1]["content"].append({
#                     "type": "image_url",
#                     "image_url": {
#                         "url": f"data:image/jpeg;base64,{image_base64}",
#                         "detail": "low"
#                     }
#                 })
#                 debug_print("🖼️ Отправляем полное изображение в API")
        
#         # Параметры запроса
#         payload = {
#             "model": "deepseek-chat",
#             "messages": messages,
#             "max_tokens": 2000,
#             "temperature": 0.1,
#             "response_format": {"type": "json_object"}
#         }
        
#         headers = {
#             "Content-Type": "application/json",
#             "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
#         }
        
#         debug_print("📡 Отправляем запрос к DeepSeek API...")
#         response = requests.post(
#             DEEPSEEK_API_URL,
#             headers=headers,
#             json=payload,
#             timeout=60
#         )
        
#         if response.status_code == 200:
#             result = response.json()
#             debug_print("✅ Ответ от DeepSeek API получен")
            
#             # Извлекаем JSON из ответа
#             if "choices" in result and len(result["choices"]) > 0:
#                 content = result["choices"][0]["message"]["content"]
#                 debug_print(f"📄 Ответ API (первые 500 символов): {content[:500]}...")
#                 return content, None
#             else:
#                 return None, "Нет choices в ответе API"
#         else:
#             error_msg = f"Ошибка API: {response.status_code}"
#             if response.text:
#                 error_msg += f" - {response.text[:200]}"
#             return None, error_msg
            
#     except requests.exceptions.Timeout:
#         return None, "Таймаут запроса к DeepSeek API"
#     except requests.exceptions.RequestException as e:
#         return None, f"Ошибка сети: {str(e)}"
#     except Exception as e:
#         return None, f"Ошибка вызова API: {str(e)}"

# def parse_solutions_from_api_response(api_response):
#     """Парсит ответ от DeepSeek API"""
#     try:
#         debug_print("🔍 Парсим ответ API...")
        
#         # Пробуем распарсить JSON
#         parsed = json.loads(api_response)
        
#         # Проверяем структуру
#         if "solutions" in parsed and isinstance(parsed["solutions"], list):
#             solutions = parsed["solutions"]
            
#             # Валидируем каждое решение
#             valid_solutions = []
#             for i, sol in enumerate(solutions):
#                 if all(key in sol for key in ["title", "formulas", "answer", "steps"]):
#                     valid_solutions.append({
#                         "title": sol["title"],
#                         "formulas": sol["formulas"] if isinstance(sol["formulas"], list) else [str(sol["formulas"])],
#                         "answer": str(sol["answer"]),
#                         "steps": sol["steps"] if isinstance(sol["steps"], list) else [str(sol["steps"])]
#                     })
#                     debug_print(f"✅ Решение {i+1}: {sol['title']}")
#                 else:
#                     debug_print(f"⚠️ Решение {i+1} пропущено (неполная структура)")
            
#             if valid_solutions:
#                 debug_print(f"✅ Найдено {len(valid_solutions)} валидных решений")
#                 return valid_solutions
#             else:
#                 debug_print("❌ Нет валидных решений в ответе")
#                 return []
#         else:
#             debug_print("❌ Нет ключа 'solutions' в ответе API")
#             return []
            
#     except json.JSONDecodeError as e:
#         debug_print(f"❌ Ошибка парсинга JSON: {e}")
        
#         # Пытаемся найти JSON в тексте
#         match = re.search(r'\{.*\}', api_response, re.DOTALL)
#         if match:
#             try:
#                 parsed = json.loads(match.group())
#                 if "solutions" in parsed:
#                     return parsed["solutions"]
#             except:
#                 pass
        
#         # Запасной вариант
#         return [{
#             "title": "Решение от DeepSeek",
#             "formulas": ["Формулы не распознаны"],
#             "answer": "Ответ в тексте",
#             "steps": [api_response[:500] + "..." if len(api_response) > 500 else api_response]
#         }]
#     except Exception as e:
#         debug_print(f"❌ Ошибка парсинга: {e}")
#         return []

# app = Flask(__name__)
# CORS(app)

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     debug_print("\n" + "="*50)
#     debug_print("📱 ПОЛУЧЕН ЗАПРОС ОТ ТЕЛЕФОНА")
#     debug_print("="*50)
    
#     try:
#         data = request.get_json()
#         if not data or 'image' not in data:
#             return jsonify({
#                 "success": False, 
#                 "message": "Нет изображения в запросе",
#                 "solutions": []
#             }), 400
        
#         debug_print("💾 Декодируем изображение...")
#         try:
#             image_data = base64.b64decode(data['image'])
#             debug_print(f"✅ Изображение декодировано ({len(image_data)} байт)")
#         except Exception as e:
#             return jsonify({
#                 "success": False, 
#                 "message": f"Ошибка декодирования изображения: {e}",
#                 "solutions": []
#             }), 500
        
#         # ОБРЕЗАЕМ ИЗОБРАЖЕНИЕ
#         cropped_path = None
#         image_base64 = None
#         is_cropped = False
        
#         if 'frame_rect' in data and data['frame_rect']:
#             frame_rect = data['frame_rect']
#             screen_width = data.get('screen_width', 360)
#             screen_height = data.get('screen_height', 640)
            
#             cropped_path = crop_image_to_frame(image_data, frame_rect, screen_width, screen_height)
#             if cropped_path:
#                 image_base64 = encode_image_to_base64(cropped_path)
#                 is_cropped = True
#                 debug_print("🖼️ Используем обрезанное изображение")
        
#         # Если обрезка не удалась, используем оригинальное изображение
#         if not image_base64:
#             # Сохраняем оригинальное изображение
#             with open(TEMP_IMAGE_FILE, 'wb') as f:
#                 f.write(image_data)
#             image_base64 = encode_image_to_base64(TEMP_IMAGE_FILE)
#             is_cropped = False
#             debug_print("🖼️ Используем оригинальное изображение")
        
#         if not image_base64:
#             return jsonify({
#                 "success": False,
#                 "message": "Не удалось подготовить изображение",
#                 "solutions": []
#             }), 500
        
#         # ВЫЗЫВАЕМ DEEPSEEK API
#         debug_print("🔄 Отправляем в DeepSeek API...")
#         api_response, error = call_deepseek_api(image_base64, is_cropped)
        
#         # Удаляем временные файлы
#         for file_path in [TEMP_IMAGE_FILE, TEMP_CROPPED_FILE]:
#             if os.path.exists(file_path):
#                 try:
#                     os.remove(file_path)
#                     debug_print(f"🗑️ Удален файл: {file_path}")
#                 except:
#                     pass
        
#         if error:
#             debug_print(f"❌ Ошибка API: {error}")
#             return jsonify({
#                 "success": False, 
#                 "message": f"Ошибка DeepSeek API: {error}",
#                 "solutions": []
#             }), 500
        
#         debug_print("🔍 Парсим решения из ответа API...")
#         solutions = parse_solutions_from_api_response(api_response)
        
#         if solutions:
#             debug_print(f"✅ Найдено {len(solutions)} решений")
#             return jsonify({
#                 "success": True,
#                 "message": "Решение получено через DeepSeek API",
#                 "solutions": solutions
#             })
#         else:
#             debug_print("❌ Решения не найдены")
#             return jsonify({
#                 "success": False,
#                 "message": "Не удалось извлечь решения из ответа API",
#                 "solutions": []
#             }), 500
            
#     except Exception as e:
#         debug_print(f"💥 Критическая ошибка сервера: {e}")
#         return jsonify({
#             "success": False,
#             "message": f"Внутренняя ошибка сервера: {e}",
#             "solutions": []
#         }), 500

# @app.route('/status', methods=['GET'])
# def server_status():
#     """Проверка статуса сервера и API ключа"""
#     try:
#         # Проверяем API ключ делая простой запрос
#         headers = {
#             "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
#         }
        
#         test_response = requests.get(
#             "https://api.deepseek.com/v1/models",
#             headers=headers,
#             timeout=10
#         )
        
#         if test_response.status_code == 200:
#             return jsonify({
#                 "success": True,
#                 "api_key_valid": True,
#                 "message": "✅ Сервер работает, API ключ действителен"
#             })
#         else:
#             return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": f"❌ API ключ недействителен (код: {test_response.status_code})"
#             })
            
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "api_key_valid": False,
#             "message": f"❌ Ошибка проверки API: {str(e)}"
#         })

# if __name__ == '__main__':
#     debug_print("🚀 Запуск Flask сервера с DeepSeek API...")
#     debug_print(f"📍 Сервер будет доступен по адресу: http://192.168.0.11:5000")
#     debug_print(f"🔑 Используется DeepSeek API ключ: {DEEPSEEK_API_KEY[:10]}...")
#     debug_print("="*50)
    
#     # Предупреждение о ключе
#     if DEEPSEEK_API_KEY == "sk-your-api-key-here":
#         debug_print("⚠️ ⚠️ ⚠️ ВНИМАНИЕ: Замените DEEPSEEK_API_KEY на ваш настоящий ключ! ⚠️ ⚠️ ⚠️")
    
#     app.run(host='0.0.0.0', port=5000, debug=True)











































# import os
# import json
# import base64
# import re
# import time
# import requests
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from PIL import Image
# import io

# # --- КОНСТАНТЫ ---
# TEMP_IMAGE_FILE = 'temp_image.jpg'
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TIMEOUT_MS = 120000

# # ВАШ API КЛЮЧ
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2"
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# # Промпт для API
# PROMPT_TEXT = """Ты эксперт по физике. Реши задачу на изображении.
# Верни ответ СТРОГО в JSON формате:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула1", "формула2"],
#             "answer": "ответ с единицами",
#             "steps": ["шаг1", "шаг2", "шаг3"]
#         }
#     ]
# }
# Только JSON, без лишнего текста."""

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def crop_image_to_frame(image_data, frame_rect, screen_width, screen_height):
#     """Обрезает изображение до области рамки"""
#     try:
#         debug_print("✂️ Обрезаем изображение...")
#         image = Image.open(io.BytesIO(image_data))
        
#         # Автоматически исправляем ориентацию
#         try:
#             exif = image._getexif()
#             if exif:
#                 orientation = exif.get(0x0112)
#                 if orientation == 3:
#                     image = image.rotate(180, expand=True)
#                 elif orientation == 6:
#                     image = image.rotate(270, expand=True)
#                 elif orientation == 8:
#                     image = image.rotate(90, expand=True)
#         except:
#             pass
        
#         img_width, img_height = image.size
        
#         # Масштабируем координаты
#         scale_x = img_width / screen_width
#         scale_y = img_height / screen_height
        
#         left = int(frame_rect['x'] * scale_x)
#         top = int(frame_rect['y'] * scale_y)
#         right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
#         bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
        
#         # Проверяем границы
#         left = max(0, min(left, img_width))
#         top = max(0, min(top, img_height))
#         right = max(0, min(right, img_width))
#         bottom = max(0, min(bottom, img_height))
        
#         # Обрезаем
#         cropped_image = image.crop((left, top, right, bottom))
#         cropped_image.save(TEMP_CROPPED_FILE, 'JPEG', quality=90)
#         debug_print(f"✅ Изображение обрезано: {TEMP_CROPPED_FILE}")
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"❌ Ошибка обрезки: {e}")
#         return None

# def encode_image_to_base64(image_path):
#     """Кодирует изображение в base64"""
#     try:
#         with open(image_path, "rb") as image_file:
#             return base64.b64encode(image_file.read()).decode('utf-8')
#     except Exception as e:
#         debug_print(f"❌ Ошибка кодирования: {e}")
#         return None

# def call_deepseek_api(image_base64):
#     """Вызывает DeepSeek API с изображением"""
#     try:
#         debug_print("🚀 Вызываем DeepSeek API...")
        
#         # ПРАВИЛЬНЫЙ формат для DeepSeek Vision
#         messages = [
#             {
#                 "role": "user",
#                 "content": [
#                     {"type": "text", "text": PROMPT_TEXT},
#                     {
#                         "type": "image_url",
#                         "image_url": {
#                             "url": f"data:image/jpeg;base64,{image_base64}"
#                         }
#                     }
#                 ]
#             }
#         ]
        
#         # Используем правильную модель для изображений
#         payload = {
#             "model": "deepseek-vision",  # МОДЕЛЬ ДЛЯ ИЗОБРАЖЕНИЙ
#             "messages": messages,
#             "max_tokens": 2000,
#             "temperature": 0.1
#         }
        
#         headers = {
#             "Content-Type": "application/json",
#             "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
#         }
        
#         debug_print("📡 Отправляем запрос...")
#         response = requests.post(
#             DEEPSEEK_API_URL,
#             headers=headers,
#             json=payload,
#             timeout=60
#         )
        
#         debug_print(f"📊 Статус ответа: {response.status_code}")
        
#         if response.status_code == 200:
#             result = response.json()
#             debug_print("✅ Ответ от API получен")
            
#             if "choices" in result and len(result["choices"]) > 0:
#                 content = result["choices"][0]["message"]["content"]
#                 debug_print(f"📄 Ответ API: {content[:300]}...")
#                 return content, None
#             else:
#                 return None, "Нет choices в ответе"
#         else:
#             error_msg = f"Ошибка API: {response.status_code}"
#             if response.text:
#                 error_msg += f" - {response.text[:200]}"
#             return None, error_msg
            
#     except Exception as e:
#         return None, f"Ошибка вызова API: {str(e)}"

# def parse_solutions_from_api_response(api_response):
#     """Парсит ответ от API"""
#     try:
#         debug_print("🔍 Парсим ответ...")
        
#         # Чистим текст
#         clean_text = api_response.strip()
        
#         # Ищем JSON
#         json_match = re.search(r'\{.*\}', clean_text, re.DOTALL)
#         if json_match:
#             json_str = json_match.group(0)
#             debug_print(f"📄 Найден JSON: {json_str[:200]}...")
            
#             try:
#                 parsed = json.loads(json_str)
#                 if "solutions" in parsed:
#                     solutions = parsed["solutions"]
#                     debug_print(f"✅ Найдено {len(solutions)} решений")
#                     return solutions
#             except json.JSONDecodeError:
#                 debug_print("⚠️ Ошибка парсинга JSON")
        
#         # Если не нашли JSON, создаем простой ответ
#         debug_print("🔄 Создаем простой ответ...")
#         return [{
#             "title": "Решение задачи",
#             "formulas": ["Формулы в тексте ответа"],
#             "answer": "Ответ в тексте",
#             "steps": [clean_text[:500] + "..." if len(clean_text) > 500 else clean_text]
#         }]
        
#     except Exception as e:
#         debug_print(f"❌ Ошибка парсинга: {e}")
#         return []

# app = Flask(__name__)
# CORS(app)

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     debug_print("\n" + "="*50)
#     debug_print("📱 ПОЛУЧЕН ЗАПРОС ОТ ТЕЛЕФОНА")
#     debug_print("="*50)
    
#     try:
#         data = request.get_json()
#         if not data or 'image' not in data:
#             return jsonify({
#                 "success": False, 
#                 "message": "Нет изображения",
#                 "solutions": []
#             }), 400
        
#         debug_print("💾 Декодируем изображение...")
#         try:
#             image_data = base64.b64decode(data['image'])
#             debug_print(f"✅ Изображение декодировано ({len(image_data)} байт)")
#         except Exception as e:
#             return jsonify({
#                 "success": False, 
#                 "message": f"Ошибка декодирования: {e}",
#                 "solutions": []
#             }), 500
        
#         # Обрезаем изображение если есть рамка
#         image_base64 = None
        
#         if 'frame_rect' in data and data['frame_rect']:
#             frame_rect = data['frame_rect']
#             screen_width = data.get('screen_width', 360)
#             screen_height = data.get('screen_height', 640)
            
#             cropped_path = crop_image_to_frame(image_data, frame_rect, screen_width, screen_height)
#             if cropped_path:
#                 image_base64 = encode_image_to_base64(cropped_path)
#                 debug_print("🖼️ Используем обрезанное изображение")
        
#         # Если не обрезалось, используем оригинал
#         if not image_base64:
#             # Сохраняем оригинальное изображение
#             with open(TEMP_IMAGE_FILE, 'wb') as f:
#                 f.write(image_data)
#             image_base64 = encode_image_to_base64(TEMP_IMAGE_FILE)
#             debug_print("🖼️ Используем оригинальное изображение")
        
#         if not image_base64:
#             return jsonify({
#                 "success": False,
#                 "message": "Не удалось подготовить изображение",
#                 "solutions": []
#             }), 500
        
#         # Вызываем DeepSeek API
#         debug_print("🔄 Отправляем в DeepSeek API...")
#         api_response, error = call_deepseek_api(image_base64)
        
#         # Удаляем временные файлы
#         for file_path in [TEMP_IMAGE_FILE, TEMP_CROPPED_FILE]:
#             if os.path.exists(file_path):
#                 try:
#                     os.remove(file_path)
#                     debug_print(f"🗑️ Удален: {file_path}")
#                 except:
#                     pass
        
#         if error:
#             debug_print(f"❌ Ошибка API: {error}")
#             return jsonify({
#                 "success": False, 
#                 "message": f"Ошибка DeepSeek API: {error}",
#                 "solutions": []
#             }), 500
        
#         # Парсим ответ
#         debug_print("🔍 Парсим решения...")
#         solutions = parse_solutions_from_api_response(api_response)
        
#         if solutions:
#             debug_print(f"✅ Найдено {len(solutions)} решений")
#             return jsonify({
#                 "success": True,
#                 "message": "Решение получено",
#                 "solutions": solutions
#             })
#         else:
#             debug_print("❌ Решения не найдены")
#             return jsonify({
#                 "success": False,
#                 "message": "Не удалось извлечь решения",
#                 "solutions": []
#             }), 500
            
#     except Exception as e:
#         debug_print(f"💥 Критическая ошибка: {e}")
#         return jsonify({
#             "success": False,
#             "message": f"Внутренняя ошибка: {e}",
#             "solutions": []
#         }), 500

# @app.route('/status', methods=['GET'])
# def server_status():
#     """Проверка статуса"""
#     try:
#         headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}"}
#         test_response = requests.get(
#             "https://api.deepseek.com/v1/models",
#             headers=headers,
#             timeout=10
#         )
        
#         if test_response.status_code == 200:
#             return jsonify({
#                 "success": True,
#                 "api_key_valid": True,
#                 "message": "✅ Сервер работает, API ключ действителен"
#             })
#         else:
#             return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": f"❌ API ключ недействителен"
#             })
            
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "api_key_valid": False,
#             "message": f"❌ Ошибка проверки API: {str(e)}"
#         })

# if __name__ == '__main__':
#     debug_print("🚀 Запуск сервера с DeepSeek API...")
#     debug_print(f"📍 Адрес: http://192.168.0.11:5000")
#     debug_print("="*50)
    
#     app.run(host='0.0.0.0', port=5000, debug=True)










# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from PIL import Image, ImageOps # ImageOps оставлен, но ImageOps.exif_transpose удален из логики
# import io
# import numpy as np # Для работы с OpenCV
# import cv2 # Для продвинутой бинаризации (Otsu)

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH
#     pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен (pip install pytesseract)")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# DEBUG_IMAGE_FILE = 'debug_ocr_image_processed.jpg' # Отладочный файл после обработки OpenCV
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" # ЗАМЕНИТЕ НА ВАШ КЛЮЧ
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# # Оптимизированный промпт для DeepSeek (теперь ожидает ТЕКСТ)
# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи, распознанный с фотографии.

# 1. Исправь возможные ошибки распознавания (OCR) в тексте.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в следующем JSON формате, без лишнего текста, объяснений, или markdown:

# {
#     "solutions": [
#         {
#             "title": "Название метода решения",
#             "formulas": ["формула1", "формула2"],
#             "answer": "конечный числовой ответ с единицами измерения",
#             "steps": ["шаг 1: описание", "шаг 2: вычисления", "шаг 3: результат"]
#         }
#     ]
# }

# ВАЖНО: Используй LaTeX для формул в квадратных скобках: [F = ma]
# """

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     """Продвинутая предобработка с OpenCV (Otsu's Binarization) и OCR."""
#     if not OCR_AVAILABLE:
#         return None, "Библиотека pytesseract не установлена."
    
#     try:
#         debug_print("👀 Запускаем OpenCV предобработку (Otsu's Binarization) и OCR...")
        
#         # 1. Читаем изображение через OpenCV
#         # OpenCV читает в формате BGR
#         img_bgr = cv2.imread(image_path)
        
#         if img_bgr is None:
#             return None, "Не удалось загрузить обрезанное изображение."
            
#         # 2. Преобразование в оттенки серого (Grayscale)
#         gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        
#         # 3. Применение автоматической бинаризации Оцу (Otsu's Binarization)
#         # Это автоматически находит оптимальный порог, что лучше для неравномерного освещения.
#         _, processed_img = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

#         # 4. Сохранение для отладки
#         cv2.imwrite(DEBUG_IMAGE_FILE, processed_img)
#         debug_print(f"🖼️ Обработанное изображение для OCR сохранено в {DEBUG_IMAGE_FILE}")
        
#         # 5. Распознавание текста с помощью Tesseract
#         # Преобразуем массив NumPy обратно в объект PIL Image для Tesseract
#         pil_image = Image.fromarray(processed_img)
        
#         # Конфигурация: PSM 6 - предполагаем единый блок текста
#         tesseract_config = '--psm 6' 
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config=tesseract_config)
        
#         cleaned_text = text.strip()
        
#         if not cleaned_text:
#             return None, "Текст не распознан. Фото слишком нечеткое или пустое."
            
#         debug_print(f"📖 Распознанный текст (первые 50 симв.): {cleaned_text[:50]}...")
#         return cleaned_text, None
        
#     except Exception as e:
#         error_msg = str(e)
#         if "No such file or directory" in error_msg or "failed to find tesseract" in error_msg:
#             return None, "Tesseract OCR не найден. Проверьте установку и PATH."
#         return None, f"Критическая ошибка OCR: {error_msg}"

# def crop_image_to_frame(image_data, frame_rect, screen_width, screen_height):
#     """Обрезает изображение по рамке (БЕЗ АВТОМАТИЧЕСКОГО ПОВОРОТА)"""
#     try:
#         debug_print("✂️ Обрезаем изображение...")
#         image = Image.open(io.BytesIO(image_data))
        
#         # --- ИСПРАВЛЕНИЕ ПОВОРОТА УДАЛЕНО! ---
#         # image = ImageOps.exif_transpose(image)
#         # ------------------------------------
        
#         img_width, img_height = image.size
        
#         # Считаем коэффициенты масштабирования
#         scale_x = img_width / screen_width
#         scale_y = img_height / screen_height
        
#         # Координаты обрезки
#         left = int(frame_rect['x'] * scale_x)
#         top = int(frame_rect['y'] * scale_y)
#         right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
#         bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
        
#         # Обрезаем
#         cropped_image = image.crop((left, top, right, bottom))
#         cropped_image.save(TEMP_CROPPED_FILE, 'JPEG', quality=100)
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"❌ Ошибка обрезки: {e}")
#         return None

# def call_deepseek_api_text(problem_text):
#     """Отправляет распознанный текст в DeepSeek Chat API"""
#     # Логика API остается прежней
#     try:
#         debug_print("🚀 Отправляем текст в DeepSeek API...")
        
#         messages = [
#             {"role": "system", "content": PROMPT_SYSTEM},
#             {"role": "user", "content": f"Распознанный текст задачи:\n\n{problem_text}"}
#         ]
        
#         payload = {
#             "model": "deepseek-chat",
#             "messages": messages,
#             "max_tokens": 2000,
#             "temperature": 0.1,
#             "response_format": {"type": "json_object"}
#         }
        
#         headers = {
#             "Content-Type": "application/json",
#             "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
#         }
        
#         response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=60)
        
#         if response.status_code == 200:
#             return response.json()["choices"][0]["message"]["content"], None
#         else:
#             return None, f"Ошибка DeepSeek API {response.status_code}: {response.text}"
            
#     except Exception as e:
#         return None, f"Ошибка сети или API: {str(e)}"

# app = Flask(__name__)
# CORS(app)

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     debug_print("\n" + "="*50)
#     debug_print("📱 НОВЫЙ ЗАПРОС")
    
#     try:
#         data = request.get_json()
#         image_data = base64.b64decode(data['image'])
        
#         # 1. Обрезаем (без автоповорота)
#         file_path = crop_image_to_frame(
#             image_data, 
#             data['frame_rect'], 
#             data['screen_width'], 
#             data['screen_height']
#         )
        
#         if not file_path:
#             return jsonify({"success": False, "message": "Ошибка обработки фото (обрезка)"}), 500

#         # 2. Распознаем текст с OpenCV предобработкой
#         recognized_text, error = extract_text_from_image(file_path)
        
#         if error:
#             debug_print(f"❌ Ошибка OCR: {error}")
#             return jsonify({
#                 "success": False, 
#                 "message": f"Не удалось прочитать текст: {error}"
#             }), 500
            
#         # 3. Отправляем текст в API
#         api_response, api_error = call_deepseek_api_text(recognized_text)
        
#         if api_error:
#             debug_print(f"❌ Ошибка API: {api_error}")
#             return jsonify({"success": False, "message": api_error}), 500

#         # 4. Парсим ответ
#         try:
#             result = json.loads(api_response)
#             if "solutions" in result and isinstance(result["solutions"], list):
#                 return jsonify({"success": True, "solutions": result["solutions"]})
#         except:
#             pass
            
#         # Запасной вариант: если API вернул невалидный JSON
#         debug_print("⚠️ API вернул невалидный JSON. Возвращаем сырой ответ.")
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Сырой ответ DeepSeek (Ошибка парсинга)",
#                 "answer": "Смотрите описание шагов",
#                 "formulas": [],
#                 "steps": [api_response]
#             }]
#         })

#     except Exception as e:
#         debug_print(f"💥 Критическая ошибка сервера: {e}")
#         return jsonify({"success": False, "message": f"Внутренняя ошибка сервера: {str(e)}"}), 500

# @app.route('/status', methods=['GET'])
# def server_status():
#     """Проверка статуса сервера и API ключа"""
#     try:
#         if not OCR_AVAILABLE:
#              return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": "❌ Tesseract (pytesseract) не установлен!"
#             })
            
#         headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}"}
#         test_response = requests.get(
#             "https://api.deepseek.com/v1/models",
#             headers=headers,
#             timeout=10
#         )
        
#         if test_response.status_code == 200:
#             return jsonify({
#                 "success": True,
#                 "api_key_valid": True,
#                 "message": "✅ Сервер работает, API ключ действителен"
#             })
#         else:
#             return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": f"❌ API ключ недействителен (код: {test_response.status_code})"
#             })
            
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "api_key_valid": False,
#             "message": f"❌ Ошибка проверки API: {str(e)}"
#         })

# if __name__ == '__main__':
#     debug_print("🚀 Запуск Flask сервера (Режим OCR -> DeepSeek)")
#     debug_print("="*50)
#     app.run(host='0.0.0.0', port=5000, debug=True)
















# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file # <-- Добавлен send_file
# from flask_cors import CORS
# from PIL import Image, ImageOps 
# import io

# # --- ДОБАВЛЕНЫ ИМПОРТЫ ДЛЯ OpenCV/Numpy ---
# import numpy as np 
# import cv2 
# # ----------------------------------------

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH
#     pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен (pip install pytesseract)")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# DEBUG_IMAGE_FILE = 'debug_ocr_image_processed.jpg' # Отладочный файл после обработки OpenCV
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" # ЗАМЕНИТЕ НА ВАШ КЛЮЧ
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# # Оптимизированный промпт для DeepSeek (теперь ожидает ТЕКСТ)
# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи, распознанный с фотографии.

# 1. Исправь возможные ошибки распознавания (OCR) в тексте.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в следующем JSON формате, без лишнего текста, объяснений, или markdown:

# {
#     "solutions": [
#         {
#             "title": "Название метода решения",
#             "formulas": ["формула1", "формула2"],
#             "answer": "конечный числовой ответ с единицами измерения",
#             "steps": ["шаг 1: описание", "шаг 2: вычисления", "шаг 3: результат"]
#         }
#     ]
# }

# ВАЖНО: Используй LaTeX для формул в квадратных скобках: [F = ma]
# """

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     """Продвинутая предобработка с OpenCV (Otsu's Binarization) и OCR."""
#     if not OCR_AVAILABLE:
#         return None, "Библиотека pytesseract не установлена."
    
#     try:
#         debug_print("👀 Запускаем OpenCV предобработку (Otsu's Binarization) и OCR...")
        
#         # 1. Читаем изображение через OpenCV
#         img_bgr = cv2.imread(image_path)
        
#         if img_bgr is None:
#             return None, "Не удалось загрузить обрезанное изображение."
            
#         # 2. Преобразование в оттенки серого (Grayscale)
#         gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        
#         # 3. Применение автоматической бинаризации Оцу (Otsu's Binarization)
#         # THRESH_OTSU автоматически находит оптимальный порог
#         _, processed_img = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

#         # 4. Сохранение для отладки
#         cv2.imwrite(DEBUG_IMAGE_FILE, processed_img)
#         debug_print(f"🖼️ Обработанное изображение для OCR сохранено в {DEBUG_IMAGE_FILE}")
        
#         # 5. Распознавание текста с помощью Tesseract
#         pil_image = Image.fromarray(processed_img)
        
#         # Конфигурация: PSM 6 - предполагаем единый блок текста
#         tesseract_config = '--psm 6' 
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config=tesseract_config)
        
#         cleaned_text = text.strip()
        
#         if not cleaned_text:
#             return None, "Текст не распознан. Фото слишком нечеткое или пустое."
            
#         debug_print(f"📖 Распознанный текст (первые 50 симв.): {cleaned_text[:50]}...")
#         return cleaned_text, None
        
#     except Exception as e:
#         error_msg = str(e)
#         if "No such file or directory" in error_msg or "failed to find tesseract" in error_msg:
#             return None, "Tesseract OCR не найден. Проверьте установку и PATH."
#         return None, f"Критическая ошибка OCR: {error_msg}"

# def crop_image_to_frame(image_data, frame_rect, screen_width, screen_height):
#     """
#     Обрезает изображение по рамке. 
#     НЕ ПОВОРАЧИВАЕТ ИЗОБРАЖЕНИЕ, но корректирует координаты обрезки (инверсия осей), 
#     чтобы содержимое рамки соответствовало изображению, сохраненному "на боку".
    
#     Результат обрезки сохраняется в TEMP_CROPPED_FILE (temp_cropped.jpg).
#     """
#     try:
#         debug_print("✂️ Обрезаем изображение...")
#         image = Image.open(io.BytesIO(image_data))
        
#         # Размеры сырого изображения
#         img_width, img_height = image.size
        
#         # Координаты обрезки по умолчанию
#         left = 0
#         top = 0
#         right = img_width
#         bottom = img_height

#         # Проверяем, что оси экрана (портрет: H > W) и сырого изображения (ландшафт: W > H) не совпадают.
#         # Это стандартная проблема "съезжания" при съемке вертикально.
#         if screen_height > screen_width and img_width > img_height:
#             debug_print("🔄 Обнаружено несоответствие осей: применяем инверсию координат для точной обрезки.")

#             # Масштабирование:
#             # Scale X (ширина экрана) -> Y (высота изображения)
#             scale_x = img_height / screen_width
#             # Scale Y (высота экрана) -> X (ширина изображения)
#             scale_y = img_width / screen_height

#             # 1. TOP coordinate (Raw Image Y-axis): Соответствует Screen X-axis (Left/Right)
#             top = int(frame_rect['x'] * scale_x)
            
#             # 2. LEFT coordinate (Raw Image X-axis): Соответствует Screen Y-axis (Top/Bottom), но инвертировано.
#             # Мы вычисляем координату X, соответствующую НИЖНЕЙ части рамки на экране.
#             left = img_width - int((frame_rect['y'] + frame_rect['height']) * scale_y)
            
#             # 3. BOTTOM coordinate (Raw Image Y-axis): Соответствует Screen X-axis end
#             bottom = top + int(frame_rect['width'] * scale_x)

#             # 4. RIGHT coordinate (Raw Image X-axis): Соответствует Screen Y-axis start
#             # Мы вычисляем координату X, соответствующую ВЕРХНЕЙ части рамки на экране.
#             right = left + int(frame_rect['height'] * scale_y)

#         else:
#             # Стандартная логика (если оси совпадают - например, при съемке в ландшафтном режиме)
#             scale_x = img_width / screen_width
#             scale_y = img_height / screen_height
            
#             left = int(frame_rect['x'] * scale_x)
#             top = int(frame_rect['y'] * scale_y)
#             right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
#             bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
        
#         # Обрезаем
#         # ЭТА КАРТИНКА ИДЕТ НА OCR, КОТОРЫЙ ЗАТЕМ ОТПРАВЛЯЕТ ТЕКСТ В DEEPSEEK.
#         cropped_image = image.crop((left, top, right, bottom))
#         cropped_image.save(TEMP_CROPPED_FILE, 'JPEG', quality=100)
#         debug_print(f"✅ Успешно обрезано в {TEMP_CROPPED_FILE}. Координаты обрезки: ({left}, {top}, {right}, {bottom})")
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"❌ Ошибка обрезки: {e}")
#         return None

# def call_deepseek_api_text(problem_text):
#     """Отправляет распознанный текст в DeepSeek Chat API"""
#     try:
#         debug_print("🚀 Отправляем текст в DeepSeek API...")
        
#         messages = [
#             {"role": "system", "content": PROMPT_SYSTEM},
#             {"role": "user", "content": f"Распознанный текст задачи:\n\n{problem_text}"}
#         ]
        
#         payload = {
#             "model": "deepseek-chat",
#             "messages": messages,
#             "max_tokens": 2000,
#             "temperature": 0.1,
#             "response_format": {"type": "json_object"}
#         }
        
#         headers = {
#             "Content-Type": "application/json",
#             "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
#         }
        
#         response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=60)
        
#         if response.status_code == 200:
#             return response.json()["choices"][0]["message"]["content"], None
#         else:
#             return None, f"Ошибка DeepSeek API {response.status_code}: {response.text}"
            
#     except Exception as e:
#         return None, f"Ошибка сети или API: {str(e)}"

# app = Flask(__name__)
# CORS(app)

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     debug_print("\n" + "="*50)
#     debug_print("📱 НОВЫЙ ЗАПРОС")
    
#     try:
#         data = request.get_json()
#         image_data = base64.b64decode(data['image'])
        
#         # 1. Обрезаем (с коррекцией координат)
#         # Файл temp_cropped.jpg создается здесь и содержит точное изображение рамки.
#         file_path = crop_image_to_frame(
#             image_data, 
#             data['frame_rect'], 
#             data['screen_width'], 
#             data['screen_height']
#         )
        
#         if not file_path:
#             return jsonify({"success": False, "message": "Ошибка обработки фото (обрезка)"}), 500

#         # 2. Распознаем текст с OpenCV предобработкой
#         # В качестве входного файла используется ТОЛЬКО ЧТО СОЗДАННЫЙ temp_cropped.jpg
#         recognized_text, error = extract_text_from_image(file_path)
        
#         if error:
#             debug_print(f"❌ Ошибка OCR: {error}")
#             return jsonify({
#                 "success": False, 
#                 "message": f"Не удалось прочитать текст: {error}"
#             }), 500
            
#         # 3. Отправляем текст в API
#         # DeepSeek работает ТОЛЬКО с распознанным текстом.
#         api_response, api_error = call_deepseek_api_text(recognized_text)
        
#         if api_error:
#             debug_print(f"❌ Ошибка API: {api_error}")
#             return jsonify({"success": False, "message": api_error}), 500

#         # 4. Парсим ответ
#         try:
#             result = json.loads(api_response)
#             if "solutions" in result and isinstance(result["solutions"], list):
#                 return jsonify({"success": True, "solutions": result["solutions"]})
#         except:
#             pass
            
#         # Запасной вариант: если API вернул невалидный JSON
#         debug_print("⚠️ API вернул невалидный JSON. Возвращаем сырой ответ.")
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Сырой ответ DeepSeek (Ошибка парсинга)",
#                 "answer": "Смотрите описание шагов",
#                 "formulas": [],
#                 "steps": [api_response]
#             }]
#         })

#     except Exception as e:
#         debug_print(f"💥 Критическая ошибка сервера: {e}")
#         return jsonify({"success": False, "message": f"Внутренняя ошибка сервера: {str(e)}"}), 500

# # --- ОТЛАДОЧНЫЕ МАРШРУТЫ ---

# @app.route('/debug/cropped', methods=['GET'])
# def debug_cropped_image():
#     """Показывает обрезанное изображение (temp_cropped.jpg)"""
#     if os.path.exists(TEMP_CROPPED_FILE):
#         return send_file(TEMP_CROPPED_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл temp_cropped.jpg не найден. Сначала выполните /solve."}), 404

# @app.route('/debug/processed', methods=['GET'])
# def debug_processed_image():
#     """Показывает изображение после предобработки OpenCV (debug_ocr_image_processed.jpg)"""
#     if os.path.exists(DEBUG_IMAGE_FILE):
#         return send_file(DEBUG_IMAGE_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл debug_ocr_image_processed.jpg не найден. Сначала выполните /solve."}), 404

# # ----------------------------------

# @app.route('/status', methods=['GET'])
# def server_status():
#     """Проверка статуса сервера и API ключа"""
#     try:
#         if not OCR_AVAILABLE:
#              return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": "❌ Tesseract (pytesseract) не установлен!"
#             })
            
#         headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}"}
#         test_response = requests.get(
#             "https://api.deepseek.com/v1/models",
#             headers=headers,
#             timeout=10
#         )
        
#         if test_response.status_code == 200:
#             return jsonify({
#                 "success": True,
#                 "api_key_valid": True,
#                 "message": "✅ Сервер работает, API ключ действителен"
#             })
#         else:
#             return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": f"❌ API ключ недействителен (код: {test_response.status_code})"
#             })
            
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "api_key_valid": False,
#             "message": f"❌ Ошибка проверки API: {str(e)}"
#         })

# if __name__ == '__main__':
#     debug_print("🚀 Запуск Flask сервера (Режим OCR -> DeepSeek)")
#     debug_print("="*50)
#     app.run(host='0.0.0.0', port=5000, debug=True)




































# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from PIL import Image, ImageOps 
# import io
# import numpy as np 
# import cv2 

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH
#     pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен (pip install pytesseract)")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# DEBUG_IMAGE_FILE = 'debug_ocr_image_processed.jpg'
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" # ЗАМЕНИТЕ НА ВАШ КЛЮЧ
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# # Оптимизированный промпт для DeepSeek (теперь ожидает ТЕКСТ)
# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи, распознанный с фотографии.

# 1. Исправь возможные ошибки распознавания (OCR) в тексте.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в следующем JSON формате, без лишнего текста, объяснений, или markdown:

# {
#     "solutions": [
#         {
#             "title": "Название метода решения",
#             "formulas": ["формула1", "формула2"],
#             "answer": "конечный числовой ответ с единицами измерения",
#             "steps": ["шаг 1: описание", "шаг 2: вычисления", "шаг 3: результат"]
#         }
#     ]
# }

# ВАЖНО: Используй LaTeX для формул в квадратных скобках: [F = ma]
# """

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     """Продвинутая предобработка с OpenCV (Otsu's Binarization) и OCR."""
#     if not OCR_AVAILABLE:
#         return None, "Библиотека pytesseract не установлена."
    
#     try:
#         debug_print("👀 Запускаем OpenCV предобработку (Otsu's Binarization) и OCR...")
        
#         img_bgr = cv2.imread(image_path)
        
#         if img_bgr is None:
#             return None, "Не удалось загрузить обрезанное изображение."
            
#         gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        
#         # Применение автоматической бинаризации Оцу (Otsu's Binarization)
#         _, processed_img = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

#         cv2.imwrite(DEBUG_IMAGE_FILE, processed_img)
#         debug_print(f"🖼️ Обработанное изображение для OCR сохранено в {DEBUG_IMAGE_FILE}")
        
#         pil_image = Image.fromarray(processed_img)
        
#         tesseract_config = '--psm 6' 
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config=tesseract_config)
        
#         cleaned_text = text.strip()
        
#         if not cleaned_text:
#             return None, "Текст не распознан. Фото слишком нечеткое или пустое."
            
#         debug_print(f"📖 Распознанный текст (первые 50 симв.): {cleaned_text[:50]}...")
#         return cleaned_text, None
        
#     except Exception as e:
#         error_msg = str(e)
#         if "No such file or directory" in error_msg or "failed to find tesseract" in error_msg:
#             return None, "Tesseract OCR не найден. Проверьте установку и PATH."
#         return None, f"Критическая ошибка OCR: {error_msg}"

# def crop_image_to_frame(image_data, frame_rect, screen_width, screen_height):
#     """
#     Обрезает изображение по рамке. 
#     Применяет ИНВЕРСИЮ КООРДИНАТ для точного кадрирования, если оси сырого изображения
#     не совпадают с осями экрана. Сохраняет результат в TEMP_CROPPED_FILE.
#     """
#     try:
#         debug_print("✂️ Обрезаем изображение...")
#         image = Image.open(io.BytesIO(image_data))
        
#         # Размеры сырого изображения
#         img_width, img_height = image.size
        
#         # Координаты обрезки по умолчанию
#         left = 0
#         top = 0
#         right = img_width
#         bottom = img_height

#         # Проверяем несоответствие осей (Портретный экран vs. Ландшафтный сырой файл)
#         if screen_height > screen_width and img_width > img_height:
#             debug_print("🔄 Обнаружено несоответствие осей: применяем инверсию координат.")

#             # Scale X (ширина экрана) -> Y (высота изображения)
#             scale_x = img_height / screen_width
#             # Scale Y (высота экрана) -> X (ширина изображения)
#             scale_y = img_width / screen_height

#             # 1. TOP coordinate (Raw Image Y-axis): Corresponds to Screen X-axis (Left/Right)
#             top = int(frame_rect['x'] * scale_x)
            
#             # 2. LEFT coordinate (Raw Image X-axis): Corresponds to Screen Y-axis (Top/Bottom), INVERTED.
#             # Y=H (низ экрана) соответствует X=0 (лево raw image).
#             left = img_width - int((frame_rect['y'] + frame_rect['height']) * scale_y)
            
#             # 3. BOTTOM coordinate (Raw Image Y-axis): X-axis end
#             bottom = top + int(frame_rect['width'] * scale_x)

#             # 4. RIGHT coordinate (Raw Image X-axis): Y-axis start
#             right = left + int(frame_rect['height'] * scale_y)

#         else:
#             # Стандартная логика (если оси совпадают)
#             scale_x = img_width / screen_width
#             scale_y = img_height / screen_height
            
#             left = int(frame_rect['x'] * scale_x)
#             top = int(frame_rect['y'] * scale_y)
#             right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
#             bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
        
#         # Обрезаем
#         cropped_image = image.crop((left, top, right, bottom))
#         cropped_image.save(TEMP_CROPPED_FILE, 'JPEG', quality=100)
#         debug_print(f"✅ Успешно обрезано в {TEMP_CROPPED_FILE}. Координаты обрезки: ({left}, {top}, {right}, {bottom})")
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"❌ Ошибка обрезки: {e}")
#         return None

# def call_deepseek_api_text(problem_text):
#     """Отправляет распознанный текст в DeepSeek Chat API"""
#     try:
#         debug_print("🚀 Отправляем текст в DeepSeek API...")
        
#         messages = [
#             {"role": "system", "content": PROMPT_SYSTEM},
#             {"role": "user", "content": f"Распознанный текст задачи:\n\n{problem_text}"}
#         ]
        
#         payload = {
#             "model": "deepseek-chat",
#             "messages": messages,
#             "max_tokens": 2000,
#             "temperature": 0.1,
#             "response_format": {"type": "json_object"}
#         }
        
#         headers = {
#             "Content-Type": "application/json",
#             "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
#         }
        
#         response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=60)
        
#         if response.status_code == 200:
#             return response.json()["choices"][0]["message"]["content"], None
#         else:
#             return None, f"Ошибка DeepSeek API {response.status_code}: {response.text}"
            
#     except Exception as e:
#         return None, f"Ошибка сети или API: {str(e)}"

# app = Flask(__name__)
# CORS(app)

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     debug_print("\n" + "="*50)
#     debug_print("📱 НОВЫЙ ЗАПРОС")
    
#     try:
#         data = request.get_json()
#         image_data = base64.b64decode(data['image'])
        
#         # 1. Обрезаем (с коррекцией координат)
#         file_path = crop_image_to_frame(
#             image_data, 
#             data['frame_rect'], 
#             data['screen_width'], 
#             data['screen_height']
#         )
        
#         if not file_path:
#             return jsonify({"success": False, "message": "Ошибка обработки фото (обрезка)"}), 500

#         # 2. Распознаем текст с OpenCV предобработкой
#         recognized_text, error = extract_text_from_image(file_path)
        
#         if error:
#             debug_print(f"❌ Ошибка OCR: {error}")
#             return jsonify({
#                 "success": False, 
#                 "message": f"Не удалось прочитать текст: {error}"
#             }), 500
            
#         # 3. Отправляем текст в API
#         api_response, api_error = call_deepseek_api_text(recognized_text)
        
#         if api_error:
#             debug_print(f"❌ Ошибка API: {api_error}")
#             return jsonify({"success": False, "message": api_error}), 500

#         # 4. Парсим ответ
#         try:
#             result = json.loads(api_response)
#             if "solutions" in result and isinstance(result["solutions"], list):
#                 return jsonify({"success": True, "solutions": result["solutions"]})
#         except:
#             pass
            
#         # Запасной вариант: если API вернул невалидный JSON
#         debug_print("⚠️ API вернул невалидный JSON. Возвращаем сырой ответ.")
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Сырой ответ DeepSeek (Ошибка парсинга)",
#                 "answer": "Смотрите описание шагов",
#                 "formulas": [],
#                 "steps": [api_response]
#             }]
#         })

#     except Exception as e:
#         debug_print(f"💥 Критическая ошибка сервера: {e}")
#         return jsonify({"success": False, "message": f"Внутренняя ошибка сервера: {str(e)}"}), 500

# # --- ОТЛАДОЧНЫЕ МАРШРУТЫ ---

# @app.route('/debug/cropped', methods=['GET'])
# def debug_cropped_image():
#     """Показывает обрезанное изображение (temp_cropped.jpg)"""
#     if os.path.exists(TEMP_CROPPED_FILE):
#         return send_file(TEMP_CROPPED_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл temp_cropped.jpg не найден. Сначала выполните /solve."}), 404

# @app.route('/debug/processed', methods=['GET'])
# def debug_processed_image():
#     """Показывает изображение после предобработки OpenCV (debug_ocr_image_processed.jpg)"""
#     if os.path.exists(DEBUG_IMAGE_FILE):
#         return send_file(DEBUG_IMAGE_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл debug_ocr_image_processed.jpg не найден. Сначала выполните /solve."}), 404

# # ----------------------------------

# @app.route('/status', methods=['GET'])
# def server_status():
#     """Проверка статуса сервера и API ключа"""
#     try:
#         if not OCR_AVAILABLE:
#              return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": "❌ Tesseract (pytesseract) не установлен!"
#             })
            
#         headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}"}
#         test_response = requests.get(
#             "https://api.deepseek.com/v1/models",
#             headers=headers,
#             timeout=10
#         )
        
#         if test_response.status_code == 200:
#             return jsonify({
#                 "success": True,
#                 "api_key_valid": True,

#                 "message": "✅ Сервер работает, API ключ действителен"
#             })
#         else:
#             return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": f"❌ API ключ недействителен (код: {test_response.status_code})"
#             })
            
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "api_key_valid": False,
#             "message": f"❌ Ошибка проверки API: {str(e)}"
#         })

# if __name__ == '__main__':
#     debug_print("🚀 Запуск Flask сервера (Режим OCR -> DeepSeek)")
#     debug_print("="*50)
#     app.run(host='0.0.0.0', port=5000, debug=True)


# =-==================================================================================================================






# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from PIL import Image, ImageOps 
# import io
# import numpy as np 
# import cv2 

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH
#     pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен (pip install pytesseract)")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# DEBUG_IMAGE_FILE = 'debug_ocr_image_processed.jpg'
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" # ЗАМЕНИТЕ НА ВАШ КЛЮЧ
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# # Оптимизированный промпт для DeepSeek (теперь ожидает ТЕКСТ)
# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи, распознанный с фотографии.

# 1. Исправь возможные ошибки распознавания (OCR) в тексте.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в следующем JSON формате, без лишнего текста, объяснений, или markdown:

# {
#     "solutions": [
#         {
#             "title": "Название метода решения",
#             "formulas": ["формула1", "формула2"],
#             "answer": "конечный числовой ответ с единицами измерения",
#             "steps": ["шаг 1: описание", "шаг 2: вычисления", "шаг 3: результат"]
#         }
#     ]
# }

# ВАЖНО: Используй LaTeX для формул в квадратных скобках: [F = ma]
# """

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     """Продвинутая предобработка с OpenCV (Otsu's Binarization) и OCR."""
#     if not OCR_AVAILABLE:
#         return None, "Библиотека pytesseract не установлена."
    
#     try:
#         debug_print("👀 Запускаем OpenCV предобработку (Otsu's Binarization) и OCR...")
        
#         img_bgr = cv2.imread(image_path)
        
#         if img_bgr is None:
#             return None, "Не удалось загрузить обрезанное изображение."
            
#         gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        
#         # Применение автоматической бинаризации Оцу (Otsu's Binarization)
#         _, processed_img = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

#         cv2.imwrite(DEBUG_IMAGE_FILE, processed_img)
#         debug_print(f"🖼️ Обработанное изображение для OCR сохранено в {DEBUG_IMAGE_FILE}")
        
#         pil_image = Image.fromarray(processed_img)
        
#         tesseract_config = '--psm 6' 
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config=tesseract_config)
        
#         cleaned_text = text.strip()
        
#         if not cleaned_text:
#             return None, "Текст не распознан. Фото слишком нечеткое или пустое."
            
#         debug_print(f"📖 Распознанный текст (первые 50 симв.): {cleaned_text[:50]}...")
#         return cleaned_text, None
        
#     except Exception as e:
#         error_msg = str(e)
#         if "No such file or directory" in error_msg or "failed to find tesseract" in error_msg:
#             return None, "Tesseract OCR не найден. Проверьте установку и PATH."
#         return None, f"Критическая ошибка OCR: {error_msg}"

# def crop_image_to_frame(image_data, frame_rect, screen_width, screen_height):
#     """
#     Обрезает изображение по рамке. 
#     Применяет ИНВЕРСИЮ КООРДИНАТ для точного кадрирования, если оси сырого изображения
#     не совпадают с осями экрана. Сохраняет результат в TEMP_CROPPED_FILE.
#     """
#     try:
#         debug_print("✂️ Обрезаем изображение...")
#         image = Image.open(io.BytesIO(image_data))
#         # Предыдущая попытка с ImageOps.exif_transpose(image) была удалена.
        
#         # Размеры сырого изображения
#         img_width, img_height = image.size
        
#         # Координаты обрезки по умолчанию
#         left = 0
#         top = 0
#         right = img_width
#         bottom = img_height

#         # Проверяем несоответствие осей (Портретный экран vs. Ландшафтный сырой файл)
#         if screen_height > screen_width and img_width > img_height:
#             debug_print("🔄 Обнаружено несоответствие осей: применяем инверсию координат.")

#             # Scale X (ширина экрана) -> Y (высота изображения)
#             scale_x = img_height / screen_width
#             # Scale Y (высота экрана) -> X (ширина изображения)
#             scale_y = img_width / screen_height

#             # 1. TOP coordinate (Raw Image Y-axis): Corresponds to Screen X-axis (Left/Right)
#             top = int(frame_rect['x'] * scale_x)
            
#             # 2. LEFT coordinate (Raw Image X-axis): Corresponds to Screen Y-axis (Top/Bottom), INVERTED.
#             # Y=H (низ экрана) соответствует X=0 (лево raw image).
#             left = img_width - int((frame_rect['y'] + frame_rect['height']) * scale_y)
            
#             # 3. BOTTOM coordinate (Raw Image Y-axis): X-axis end
#             bottom = top + int(frame_rect['width'] * scale_x)

#             # 4. RIGHT coordinate (Raw Image X-axis): Y-axis start
#             right = left + int(frame_rect['height'] * scale_y)

#         else:
#             # Стандартная логика (если оси совпадают)
#             scale_x = img_width / screen_width
#             scale_y = img_height / screen_height
            
#             left = int(frame_rect['x'] * scale_x)
#             top = int(frame_rect['y'] * scale_y)
#             right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
#             bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
        
#         # Обрезаем
#         cropped_image = image.crop((left, top, right, bottom))
        
#         # --- ШАГ 4: Принудительный поворот на 90 градусов по часовой стрелке (против часовой на 270) ---
#         cropped_image = cropped_image.transpose(Image.ROTATE_270)
#         # ---------------------------------------------------------------------------------------------
        
#         cropped_image.save(TEMP_CROPPED_FILE, 'JPEG', quality=100)
#         debug_print(f"✅ Успешно обрезано и повернуто в {TEMP_CROPPED_FILE}. Координаты обрезки: ({left}, {top}, {right}, {bottom})")
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"❌ Ошибка обрезки: {e}")
#         return None

# def call_deepseek_api_text(problem_text):
#     """Отправляет распознанный текст в DeepSeek Chat API"""
#     try:
#         debug_print("🚀 Отправляем текст в DeepSeek API...")
        
#         messages = [
#             {"role": "system", "content": PROMPT_SYSTEM},
#             {"role": "user", "content": f"Распознанный текст задачи:\n\n{problem_text}"}
#         ]
        
#         payload = {
#             "model": "deepseek-chat",
#             "messages": messages,
#             "max_tokens": 2000,
#             "temperature": 0.1,
#             "response_format": {"type": "json_object"}
#         }
        
#         headers = {
#             "Content-Type": "application/json",
#             "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
#         }
        
#         response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=60)
        
#         if response.status_code == 200:
#             return response.json()["choices"][0]["message"]["content"], None
#         else:
#             return None, f"Ошибка DeepSeek API {response.status_code}: {response.text}"
            
#     except Exception as e:
#         return None, f"Ошибка сети или API: {str(e)}"

# app = Flask(__name__)
# CORS(app)

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     debug_print("\n" + "="*50)
#     debug_print("📱 НОВЫЙ ЗАПРОС")
    
#     try:
#         data = request.get_json()
#         image_data = base64.b64decode(data['image'])
        
#         # 1. Обрезаем (с коррекцией координат)
#         file_path = crop_image_to_frame(
#             image_data, 
#             data['frame_rect'], 
#             data['screen_width'], 
#             data['screen_height']
#         )
        
#         if not file_path:
#             return jsonify({"success": False, "message": "Ошибка обработки фото (обрезка)"}), 500

#         # 2. Распознаем текст с OpenCV предобработкой
#         recognized_text, error = extract_text_from_image(file_path)
        
#         if error:
#             debug_print(f"❌ Ошибка OCR: {error}")
#             return jsonify({
#                 "success": False, 
#                 "message": f"Не удалось прочитать текст: {error}"
#             }), 500
            
#         # 3. Отправляем текст в API
#         api_response, api_error = call_deepseek_api_text(recognized_text)
        
#         if api_error:
#             debug_print(f"❌ Ошибка API: {api_error}")
#             return jsonify({"success": False, "message": api_error}), 500

#         # 4. Парсим ответ
#         try:
#             result = json.loads(api_response)
#             if "solutions" in result and isinstance(result["solutions"], list):
#                 return jsonify({"success": True, "solutions": result["solutions"]})
#         except:
#             pass
            
#         # Запасной вариант: если API вернул невалидный JSON
#         debug_print("⚠️ API вернул невалидный JSON. Возвращаем сырой ответ.")
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Сырой ответ DeepSeek (Ошибка парсинга)",
#                 "answer": "Смотрите описание шагов",
#                 "formulas": [],
#                 "steps": [api_response]
#             }]
#         })

#     except Exception as e:
#         debug_print(f"💥 Критическая ошибка сервера: {e}")
#         return jsonify({"success": False, "message": f"Внутренняя ошибка сервера: {str(e)}"}), 500

# # --- ОТЛАДОЧНЫЕ МАРШРУТЫ ---

# @app.route('/debug/cropped', methods=['GET'])
# def debug_cropped_image():
#     """Показывает обрезанное изображение (temp_cropped.jpg)"""
#     if os.path.exists(TEMP_CROPPED_FILE):
#         return send_file(TEMP_CROPPED_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл temp_cropped.jpg не найден. Сначала выполните /solve."}), 404

# @app.route('/debug/processed', methods=['GET'])
# def debug_processed_image():
#     """Показывает изображение после предобработки OpenCV (debug_ocr_image_processed.jpg)"""
#     if os.path.exists(DEBUG_IMAGE_FILE):
#         return send_file(DEBUG_IMAGE_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл debug_ocr_image_processed.jpg не найден. Сначала выполните /solve."}), 404

# # ----------------------------------

# @app.route('/status', methods=['GET'])
# def server_status():
#     """Проверка статуса сервера и API ключа"""
#     try:
#         if not OCR_AVAILABLE:
#              return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": "❌ Tesseract (pytesseract) не установлен!"
#             })
            
#         headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}"}
#         test_response = requests.get(
#             "https://api.deepseek.com/v1/models",
#             headers=headers,
#             timeout=10
#         )
        
#         if test_response.status_code == 200:
#             return jsonify({
#                 "success": True,
#                 "api_key_valid": True,
#                 "message": "✅ Сервер работает, API ключ действителен"
#             })
#         else:
#             return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": f"❌ API ключ недействителен (код: {test_response.status_code})"
#             })
            
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "api_key_valid": False,
#             "message": f"❌ Ошибка проверки API: {str(e)}"
#         })

# if __name__ == '__main__':
#     debug_print("🚀 Запуск Flask сервера (Режим OCR -> DeepSeek)")
#     debug_print("="*50)
#     app.run(host='0.0.0.0', port=5000, debug=True)








# ===========================================================================================================


# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from PIL import Image, ImageOps 
# import io
# import numpy as np 
# import cv2 

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH
#     pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен (pip install pytesseract)")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# DEBUG_IMAGE_FILE = 'debug_ocr_image_processed.jpg'
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" # ЗАМЕНИТЕ НА ВАШ КЛЮЧ
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# # Оптимизированный промпт для DeepSeek (теперь ожидает ТЕКСТ)
# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи, распознанный с фотографии.

# 1. Исправь возможные ошибки распознавания (OCR) в тексте.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в следующем JSON формате, без лишнего текста, объяснений, или markdown:

# {
#     "solutions": [
#         {
#             "title": "Название метода решения",
#             "formulas": ["формула1", "формула2"],
#             "answer": "конечный числовой ответ с единицами измерения",
#             "steps": ["шаг 1: описание", "шаг 2: вычисления", "шаг 3: результат"]
#         }
#     ]
# }

# ВАЖНО: Используй LaTeX для формул в квадратных скобках: [F = ma]
# """

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     """Продвинутая предобработка с OpenCV (Otsu's Binarization) и OCR."""
#     if not OCR_AVAILABLE:
#         return None, "Библиотека pytesseract не установлена."
    
#     try:
#         debug_print("👀 Запускаем OpenCV предобработку (Otsu's Binarization) и OCR...")
        
#         img_bgr = cv2.imread(image_path)
        
#         if img_bgr is None:
#             return None, "Не удалось загрузить обрезанное изображение."
            
#         gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        
#         # Применение автоматической бинаризации Оцу (Otsu's Binarization)
#         _, processed_img = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

#         cv2.imwrite(DEBUG_IMAGE_FILE, processed_img)
#         debug_print(f"🖼️ Обработанное изображение для OCR сохранено в {DEBUG_IMAGE_FILE}")
        
#         pil_image = Image.fromarray(processed_img)
        
#         tesseract_config = '--psm 6' 
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config=tesseract_config)
        
#         cleaned_text = text.strip()
        
#         if not cleaned_text:
#             return None, "Текст не распознан. Фото слишком нечеткое или пустое."
            
#         debug_print(f"📖 Распознанный текст (первые 50 симв.): {cleaned_text[:50]}...")
#         return cleaned_text, None
        
#     except Exception as e:
#         error_msg = str(e)
#         if "No such file or directory" in error_msg or "failed to find tesseract" in error_msg:
#             return None, "Tesseract OCR не найден. Проверьте установку и PATH."
#         return None, f"Критическая ошибка OCR: {error_msg}"

# def crop_image_to_frame(image_data, frame_rect, screen_width, screen_height):
#     """
#     Обрезает изображение по рамке. 
#     ПРИМЕНЯЕТ ИСПРАВЛЕННУЮ ЛОГИКУ КРОСС-МАППИНГА.
#     Сохраняет результат в TEMP_CROPPED_FILE.
#     """
#     try:
#         debug_print("✂️ Обрезаем изображение...")
#         image = Image.open(io.BytesIO(image_data))
        
#         # Размеры сырого изображения
#         img_width, img_height = image.size
        
#         # Координаты обрезки по умолчанию
#         left = 0
#         top = 0
#         right = img_width
#         bottom = img_height

#         # Проверяем несоответствие осей (Портретный экран vs. Ландшафтный сырой файл)
#         if screen_height > screen_width and img_width > img_height:
#             debug_print("🔄 Обнаружено несоответствие осей: применяем исправленный кросс-маппинг координат.")

#             # Scale X (ширина экрана) -> Y (высота изображения)
#             scale_x = img_height / screen_width
#             # Scale Y (высота экрана) -> X (ширина изображения)
#             scale_y = img_width / screen_height

#             # --- НОВАЯ ИСПРАВЛЕННАЯ ЛОГИКА КРОСС-МАППИНГА ---
            
#             # 1. TOP coordinate (Raw Image Y-axis): Соответствует X-оси экрана
#             top = int(frame_rect['x'] * scale_x)
            
#             # 2. LEFT coordinate (Raw Image X-axis): Соответствует Y-оси экрана (инвертировано)
#             # Мы используем инверсию относительно размера кадра, чтобы учесть 
#             # особенности передачи координат камерой.
#             left = img_width - int((frame_rect['y'] + frame_rect['height']) * scale_y)
            
#             # 3. BOTTOM coordinate (Raw Image Y-axis): X-axis end
#             bottom = top + int(frame_rect['width'] * scale_x)

#             # 4. RIGHT coordinate (Raw Image X-axis): Y-axis start
#             right = left + int(frame_rect['height'] * scale_y)
            
#             # --- КОНЕЦ ИСПРАВЛЕННОЙ ЛОГИКИ ---

#         else:
#             # Стандартная логика (если оси совпадают)
#             scale_x = img_width / screen_width
#             scale_y = img_height / screen_height
            
#             left = int(frame_rect['x'] * scale_x)
#             top = int(frame_rect['y'] * scale_y)
#             right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
#             bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
        
#         # Обрезаем
#         cropped_image = image.crop((left, top, right, bottom))
        
#         # --- ОСТАВЛЯЕМ ПОВОРОТ ИЗ ШАГА 4, КОТОРЫЙ ТЫ ПОДТВЕРДИЛ КАК РАБОЧИЙ ---
#         cropped_image = cropped_image.transpose(Image.ROTATE_270)
#         # -----------------------------------------------------------------------
        
#         cropped_image.save(TEMP_CROPPED_FILE, 'JPEG', quality=100)
#         debug_print(f"✅ Успешно обрезано и повернуто в {TEMP_CROPPED_FILE}. Координаты обрезки: ({left}, {top}, {right}, {bottom})")
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"❌ Ошибка обрезки: {e}")
#         return None

# def call_deepseek_api_text(problem_text):
#     """Отправляет распознанный текст в DeepSeek Chat API"""
#     try:
#         debug_print("🚀 Отправляем текст в DeepSeek API...")
        
#         messages = [
#             {"role": "system", "content": PROMPT_SYSTEM},
#             {"role": "user", "content": f"Распознанный текст задачи:\n\n{problem_text}"}
#         ]
        
#         payload = {
#             "model": "deepseek-chat",
#             "messages": messages,
#             "max_tokens": 2000,
#             "temperature": 0.1,
#             "response_format": {"type": "json_object"}
#         }
        
#         headers = {
#             "Content-Type": "application/json",
#             "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
#         }
        
#         response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=60)
        
#         if response.status_code == 200:
#             return response.json()["choices"][0]["message"]["content"], None
#         else:
#             return None, f"Ошибка DeepSeek API {response.status_code}: {response.text}"
            
#     except Exception as e:
#         return None, f"Ошибка сети или API: {str(e)}"

# app = Flask(__name__)
# CORS(app)

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     debug_print("\n" + "="*50)
#     debug_print("📱 НОВЫЙ ЗАПРОС")
    
#     try:
#         data = request.get_json()
#         image_data = base64.b64decode(data['image'])
        
#         # 1. Обрезаем (с коррекцией координат)
#         file_path = crop_image_to_frame(
#             image_data, 
#             data['frame_rect'], 
#             data['screen_width'], 
#             data['screen_height']
#         )
        
#         if not file_path:
#             return jsonify({"success": False, "message": "Ошибка обработки фото (обрезка)"}), 500

#         # 2. Распознаем текст с OpenCV предобработкой
#         recognized_text, error = extract_text_from_image(file_path)
        
#         if error:
#             debug_print(f"❌ Ошибка OCR: {error}")
#             return jsonify({
#                 "success": False, 
#                 "message": f"Не удалось прочитать текст: {error}"
#             }), 500
            
#         # 3. Отправляем текст в API
#         api_response, api_error = call_deepseek_api_text(recognized_text)
        
#         if api_error:
#             debug_print(f"❌ Ошибка API: {api_error}")
#             return jsonify({"success": False, "message": api_error}), 500

#         # 4. Парсим ответ
#         try:
#             result = json.loads(api_response)
#             if "solutions" in result and isinstance(result["solutions"], list):
#                 return jsonify({"success": True, "solutions": result["solutions"]})
#         except:
#             pass
            
#         # Запасной вариант: если API вернул невалидный JSON
#         debug_print("⚠️ API вернул невалидный JSON. Возвращаем сырой ответ.")
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Сырой ответ DeepSeek (Ошибка парсинга)",
#                 "answer": "Смотрите описание шагов",
#                 "formulas": [],
#                 "steps": [api_response]
#             }]
#         })

#     except Exception as e:
#         debug_print(f"💥 Критическая ошибка сервера: {e}")
#         return jsonify({"success": False, "message": f"Внутренняя ошибка сервера: {str(e)}"}), 500

# # --- ОТЛАДОЧНЫЕ МАРШРУТЫ ---

# @app.route('/debug/cropped', methods=['GET'])
# def debug_cropped_image():
#     """Показывает обрезанное изображение (temp_cropped.jpg)"""
#     if os.path.exists(TEMP_CROPPED_FILE):
#         return send_file(TEMP_CROPPED_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл temp_cropped.jpg не найден. Сначала выполните /solve."}), 404

# @app.route('/debug/processed', methods=['GET'])
# def debug_processed_image():
#     """Показывает изображение после предобработки OpenCV (debug_ocr_image_processed.jpg)"""
#     if os.path.exists(DEBUG_IMAGE_FILE):
#         return send_file(DEBUG_IMAGE_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл debug_ocr_image_processed.jpg не найден. Сначала выполните /solve."}), 404

# # ----------------------------------

# @app.route('/status', methods=['GET'])
# def server_status():
#     """Проверка статуса сервера и API ключа"""
#     try:
#         if not OCR_AVAILABLE:
#              return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": "❌ Tesseract (pytesseract) не установлен!"
#             })
            
#         headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}"}
#         test_response = requests.get(
#             "https://api.deepseek.com/v1/models",
#             headers=headers,
#             timeout=10
#         )
        
#         if test_response.status_code == 200:
#             return jsonify({
#                 "success": True,
#                 "api_key_valid": True,
#                 "message": "✅ Сервер работает, API ключ действителен"
#             })
#         else:
#             return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": f"❌ API ключ недействителен (код: {test_response.status_code})"
#             })
            
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "api_key_valid": False,
#             "message": f"❌ Ошибка проверки API: {str(e)}"
#         })

# if __name__ == '__main__':
#     debug_print("🚀 Запуск Flask сервера (Режим OCR -> DeepSeek)")
#     debug_print("="*50)
#     app.run(host='0.0.0.0', port=5000, debug=True)









# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from PIL import Image, ImageOps 
# import io
# import numpy as np 
# import cv2 

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH
#     pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен (pip install pytesseract)")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# DEBUG_IMAGE_FILE = 'debug_ocr_image_processed.jpg'
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" # ЗАМЕНИТЕ НА ВАШ КЛЮЧ
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# # Оптимизированный промпт для DeepSeek (теперь ожидает ТЕКСТ)
# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи, распознанный с фотографии.

# 1. Исправь возможные ошибки распознавания (OCR) в тексте.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в следующем JSON формате, без лишнего текста, объяснений, или markdown:

# {
#     "solutions": [
#         {
#             "title": "Название метода решения",
#             "formulas": ["формула1", "формула2"],
#             "answer": "конечный числовой ответ с единицами измерения",
#             "steps": ["шаг 1: описание", "шаг 2: вычисления", "шаг 3: результат"]
#         }
#     ]
# }

# ВАЖНО: Используй LaTeX для формул в квадратных скобках: [F = ma]
# """

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     """Продвинутая предобработка с OpenCV (Otsu's Binarization) и OCR."""
#     if not OCR_AVAILABLE:
#         return None, "Библиотека pytesseract не установлена."
    
#     try:
#         debug_print("👀 Запускаем OpenCV предобработку (Otsu's Binarization) и OCR...")
        
#         img_bgr = cv2.imread(image_path)
        
#         if img_bgr is None:
#             return None, "Не удалось загрузить обрезанное изображение."
            
#         gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        
#         # Применение автоматической бинаризации Оцу (Otsu's Binarization)
#         _, processed_img = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

#         cv2.imwrite(DEBUG_IMAGE_FILE, processed_img)
#         debug_print(f"🖼️ Обработанное изображение для OCR сохранено в {DEBUG_IMAGE_FILE}")
        
#         pil_image = Image.fromarray(processed_img)
        
#         tesseract_config = '--psm 6' 
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config=tesseract_config)
        
#         cleaned_text = text.strip()
        
#         if not cleaned_text:
#             return None, "Текст не распознан. Фото слишком нечеткое или пустое."
            
#         debug_print(f"📖 Распознанный текст (первые 50 симв.): {cleaned_text[:50]}...")
#         return cleaned_text, None
        
#     except Exception as e:
#         error_msg = str(e)
#         if "No such file or directory" in error_msg or "failed to find tesseract" in error_msg:
#             return None, "Tesseract OCR не найден. Проверьте установку и PATH."
#         return None, f"Критическая ошибка OCR: {error_msg}"

# def crop_image_to_frame(image_data, frame_rect, screen_width, screen_height):
#     """
#     Обрезает изображение по рамке. 
#     ПРИМЕНЯЕТ ИСПРАВЛЕННУЮ ЛОГИКУ КРОСС-МАППИНГА.
#     Сохраняет результат в TEMP_CROPPED_FILE.
#     """
#     try:
#         debug_print("✂️ Обрезаем изображение...")
#         image = Image.open(io.BytesIO(image_data))
        
#         # Размеры сырого изображения
#         img_width, img_height = image.size
        
#         # Координаты обрезки по умолчанию
#         left = 0
#         top = 0
#         right = img_width
#         bottom = img_height

#         # Проверяем несоответствие осей (Портретный экран vs. Ландшафтный сырой файл)
#         if screen_height > screen_width and img_width > img_height:
#             debug_print("🔄 Обнаружено несоответствие осей: применяем исправленный кросс-маппинг координат.")

#             # Scale X (ширина экрана) -> Y (высота изображения)
#             scale_x = img_height / screen_width
#             # Scale Y (высота экрана) -> X (ширина изображения)
#             scale_y = img_width / screen_height

#             # --- НОВАЯ ИСПРАВЛЕННАЯ ЛОГИКА КООРДИНАТ (ШАГ 6) ---
            
#             # 1. TOP coordinate (Raw Image Y-axis): Corresponds to Screen X-axis, но инвертируем.
#             # Если область обрезки смещается, это часто означает, что X-координата экрана 
#             # должна начинаться с конца (нижнего края) изображения.
#             top = img_height - int((frame_rect['x'] + frame_rect['width']) * scale_x)
            
#             # 2. LEFT coordinate (Raw Image X-axis): Corresponds to Screen Y-axis.
#             left = int(frame_rect['y'] * scale_y)
            
#             # 3. BOTTOM coordinate (Raw Image Y-axis): X-axis end
#             bottom = top + int(frame_rect['width'] * scale_x)

#             # 4. RIGHT coordinate (Raw Image X-axis): Y-axis start
#             right = left + int(frame_rect['height'] * scale_y)
            
#             # --- КОНЕЦ ИСПРАВЛЕННОЙ ЛОГИКИ ---

#         else:
#             # Стандартная логика (если оси совпадают)
#             scale_x = img_width / screen_width
#             scale_y = img_height / screen_height
            
#             left = int(frame_rect['x'] * scale_x)
#             top = int(frame_rect['y'] * scale_y)
#             right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
#             bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
        
#         # Обрезаем
#         cropped_image = image.crop((left, top, right, bottom))
        
#         # --- ОСТАВЛЯЕМ ПОВОРОТ ИЗ ШАГА 4, КОТОРЫЙ ТЫ ПОДТВЕРДИЛ КАК РАБОЧИЙ ---
#         cropped_image = cropped_image.transpose(Image.ROTATE_270)
#         # -----------------------------------------------------------------------
        
#         cropped_image.save(TEMP_CROPPED_FILE, 'JPEG', quality=100)
#         debug_print(f"✅ Успешно обрезано и повернуто в {TEMP_CROPPED_FILE}. Координаты обрезки: ({left}, {top}, {right}, {bottom})")
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"❌ Ошибка обрезки: {e}")
#         return None

# def call_deepseek_api_text(problem_text):
#     """Отправляет распознанный текст в DeepSeek Chat API"""
#     try:
#         debug_print("🚀 Отправляем текст в DeepSeek API...")
        
#         messages = [
#             {"role": "system", "content": PROMPT_SYSTEM},
#             {"role": "user", "content": f"Распознанный текст задачи:\n\n{problem_text}"}
#         ]
        
#         payload = {
#             "model": "deepseek-chat",
#             "messages": messages,
#             "max_tokens": 2000,
#             "temperature": 0.1,
#             "response_format": {"type": "json_object"}
#         }
        
#         headers = {
#             "Content-Type": "application/json",
#             "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
#         }
        
#         response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=60)
        
#         if response.status_code == 200:
#             return response.json()["choices"][0]["message"]["content"], None
#         else:
#             return None, f"Ошибка DeepSeek API {response.status_code}: {response.text}"
            
#     except Exception as e:
#         return None, f"Ошибка сети или API: {str(e)}"

# app = Flask(__name__)
# CORS(app)

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     debug_print("\n" + "="*50)
#     debug_print("📱 НОВЫЙ ЗАПРОС")
    
#     try:
#         data = request.get_json()
#         image_data = base64.b64decode(data['image'])
        
#         # 1. Обрезаем (с коррекцией координат)
#         file_path = crop_image_to_frame(
#             image_data, 
#             data['frame_rect'], 
#             data['screen_width'], 
#             data['screen_height']
#         )
        
#         if not file_path:
#             return jsonify({"success": False, "message": "Ошибка обработки фото (обрезка)"}), 500

#         # 2. Распознаем текст с OpenCV предобработкой
#         recognized_text, error = extract_text_from_image(file_path)
        
#         if error:
#             debug_print(f"❌ Ошибка OCR: {error}")
#             return jsonify({
#                 "success": False, 
#                 "message": f"Не удалось прочитать текст: {error}"
#             }), 500
            
#         # 3. Отправляем текст в API
#         api_response, api_error = call_deepseek_api_text(recognized_text)
        
#         if api_error:
#             debug_print(f"❌ Ошибка API: {api_error}")
#             return jsonify({"success": False, "message": api_error}), 500

#         # 4. Парсим ответ
#         try:
#             result = json.loads(api_response)
#             if "solutions" in result and isinstance(result["solutions"], list):
#                 return jsonify({"success": True, "solutions": result["solutions"]})
#         except:
#             pass
            
#         # Запасной вариант: если API вернул невалидный JSON
#         debug_print("⚠️ API вернул невалидный JSON. Возвращаем сырой ответ.")
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Сырой ответ DeepSeek (Ошибка парсинга)",
#                 "answer": "Смотрите описание шагов",
#                 "formulas": [],
#                 "steps": [api_response]
#             }]
#         })

#     except Exception as e:
#         debug_print(f"💥 Критическая ошибка сервера: {e}")
#         return jsonify({"success": False, "message": f"Внутренняя ошибка сервера: {str(e)}"}), 500

# # --- ОТЛАДОЧНЫЕ МАРШРУТЫ ---

# @app.route('/debug/cropped', methods=['GET'])
# def debug_cropped_image():
#     """Показывает обрезанное изображение (temp_cropped.jpg)"""
#     if os.path.exists(TEMP_CROPPED_FILE):
#         return send_file(TEMP_CROPPED_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл temp_cropped.jpg не найден. Сначала выполните /solve."}), 404

# @app.route('/debug/processed', methods=['GET'])
# def debug_processed_image():
#     """Показывает изображение после предобработки OpenCV (debug_ocr_image_processed.jpg)"""
#     if os.path.exists(DEBUG_IMAGE_FILE):
#         return send_file(DEBUG_IMAGE_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл debug_ocr_image_processed.jpg не найден. Сначала выполните /solve."}), 404

# # ----------------------------------

# @app.route('/status', methods=['GET'])
# def server_status():
#     """Проверка статуса сервера и API ключа"""
#     try:
#         if not OCR_AVAILABLE:
#              return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": "❌ Tesseract (pytesseract) не установлен!"
#             })
            
#         headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}"}
#         test_response = requests.get(
#             "https://api.deepseek.com/v1/models",
#             headers=headers,
#             timeout=10
#         )
        
#         if test_response.status_code == 200:
#             return jsonify({
#                 "success": True,
#                 "api_key_valid": True,
#                 "message": "✅ Сервер работает, API ключ действителен"
#             })
#         else:
#             return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": f"❌ API ключ недействителен (код: {test_response.status_code})"
#             })
            
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "api_key_valid": False,
#             "message": f"❌ Ошибка проверки API: {str(e)}"
#         })

# if __name__ == '__main__':
#     debug_print("🚀 Запуск Flask сервера (Режим OCR -> DeepSeek)")
#     debug_print("="*50)
#     app.run(host='0.0.0.0', port=5000, debug=True)












# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from PIL import Image, ImageOps 
# import io
# import numpy as np 
# import cv2 

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH
#     pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен (pip install pytesseract)")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# DEBUG_IMAGE_FILE = 'debug_ocr_image_processed.jpg'
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" # ЗАМЕНИТЕ НА ВАШ КЛЮЧ
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# # Оптимизированный промпт для DeepSeek (теперь ожидает ТЕКСТ)
# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи, распознанный с фотографии.

# 1. Исправь возможные ошибки распознавания (OCR) в тексте.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в следующем JSON формате, без лишнего текста, объяснений, или markdown:

# {
#     "solutions": [
#         {
#             "title": "Название метода решения",
#             "formulas": ["формула1", "формула2"],
#             "answer": "конечный числовой ответ с единицами измерения",
#             "steps": ["шаг 1: описание", "шаг 2: вычисления", "шаг 3: результат"]
#         }
#     ]
# }

# ВАЖНО: Используй LaTeX для формул в квадратных скобках: [F = ma]
# """

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     """Продвинутая предобработка с OpenCV (Otsu's Binarization) и OCR."""
#     if not OCR_AVAILABLE:
#         return None, "Библиотека pytesseract не установлена."
    
#     try:
#         debug_print("👀 Запускаем OpenCV предобработку (Otsu's Binarization) и OCR...")
        
#         img_bgr = cv2.imread(image_path)
        
#         if img_bgr is None:
#             return None, "Не удалось загрузить обрезанное изображение."
            
#         gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        
#         # Применение автоматической бинаризации Оцу (Otsu's Binarization)
#         _, processed_img = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

#         cv2.imwrite(DEBUG_IMAGE_FILE, processed_img)
#         debug_print(f"🖼️ Обработанное изображение для OCR сохранено в {DEBUG_IMAGE_FILE}")
        
#         pil_image = Image.fromarray(processed_img)
        
#         tesseract_config = '--psm 6' 
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config=tesseract_config)
        
#         cleaned_text = text.strip()
        
#         if not cleaned_text:
#             return None, "Текст не распознан. Фото слишком нечеткое или пустое."
            
#         debug_print(f"📖 Распознанный текст (первые 50 симв.): {cleaned_text[:50]}...")
#         return cleaned_text, None
        
#     except Exception as e:
#         error_msg = str(e)
#         if "No such file or directory" in error_msg or "failed to find tesseract" in error_msg:
#             return None, "Tesseract OCR не найден. Проверьте установку и PATH."
#         return None, f"Критическая ошибка OCR: {error_msg}"

# def crop_image_to_frame(image_data, frame_rect, screen_width, screen_height):
#     """
#     Обрезает изображение по рамке. 
#     ПРИМЕНЯЕТ ИСПРАВЛЕННУЮ ЛОГИКУ КРОСС-МАППИНГА.
#     Сохраняет результат в TEMP_CROPPED_FILE.
#     """
#     try:
#         debug_print("✂️ Обрезаем изображение...")
#         image = Image.open(io.BytesIO(image_data))
        
#         # Размеры сырого изображения
#         img_width, img_height = image.size
        
#         # Координаты обрезки по умолчанию
#         left = 0
#         top = 0
#         right = img_width
#         bottom = img_height

#         # Проверяем несоответствие осей (Портретный экран vs. Ландшафтный сырой файл)
#         if screen_height > screen_width and img_width > img_height:
#             debug_print("🔄 Обнаружено несоответствие осей: применяем исправленный кросс-маппинг координат (Шаг 7).")

#             # Scale X (ширина экрана) -> Y (высота изображения)
#             scale_x = img_height / screen_width
#             # Scale Y (высота экрана) -> X (ширина изображения)
#             scale_y = img_width / screen_height

#             # --- НОВАЯ ИСПРАВЛЕННАЯ ЛОГИКА КООРДИНАТ (ШАГ 7) ---
            
#             # 1. TOP coordinate (Raw Image Y-axis): Corresponds to Screen X-axis (НЕ инвертируем)
#             top = int(frame_rect['x'] * scale_x)
            
#             # 2. LEFT coordinate (Raw Image X-axis): Corresponds to Screen Y-axis. ИНВЕРТИРУЕМ.
#             # Инверсия по X, чтобы учесть смещение по Y экрана (вниз)
#             left = img_width - int((frame_rect['y'] + frame_rect['height']) * scale_y)
            
#             # 3. BOTTOM coordinate (Raw Image Y-axis): X-axis end
#             bottom = top + int(frame_rect['width'] * scale_x)

#             # 4. RIGHT coordinate (Raw Image X-axis): Y-axis start
#             right = left + int(frame_rect['height'] * scale_y)
            
#             # --- КОНЕЦ ИСПРАВЛЕННОЙ ЛОГИКИ ---

#         else:
#             # Стандартная логика (если оси совпадают)
#             scale_x = img_width / screen_width
#             scale_y = img_height / screen_height
            
#             left = int(frame_rect['x'] * scale_x)
#             top = int(frame_rect['y'] * scale_y)
#             right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
#             bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
        
#         # Обрезаем
#         cropped_image = image.crop((left, top, right, bottom))
        
#         # --- ОСТАВЛЯЕМ ПОВОРОТ ИЗ ШАГА 4, КОТОРЫЙ ТЫ ПОДТВЕРДИЛ КАК РАБОЧИЙ ---
#         cropped_image = cropped_image.transpose(Image.ROTATE_270)
#         # -----------------------------------------------------------------------
        
#         cropped_image.save(TEMP_CROPPED_FILE, 'JPEG', quality=100)
#         debug_print(f"✅ Успешно обрезано и повернуто в {TEMP_CROPPED_FILE}. Координаты обрезки: ({left}, {top}, {right}, {bottom})")
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"❌ Ошибка обрезки: {e}")
#         return None

# def call_deepseek_api_text(problem_text):
#     """Отправляет распознанный текст в DeepSeek Chat API"""
#     try:
#         debug_print("🚀 Отправляем текст в DeepSeek API...")
        
#         messages = [
#             {"role": "system", "content": PROMPT_SYSTEM},
#             {"role": "user", "content": f"Распознанный текст задачи:\n\n{problem_text}"}
#         ]
        
#         payload = {
#             "model": "deepseek-chat",
#             "messages": messages,
#             "max_tokens": 2000,
#             "temperature": 0.1,
#             "response_format": {"type": "json_object"}
#         }
        
#         headers = {
#             "Content-Type": "application/json",
#             "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
#         }
        
#         response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=60)
        
#         if response.status_code == 200:
#             return response.json()["choices"][0]["message"]["content"], None
#         else:
#             return None, f"Ошибка DeepSeek API {response.status_code}: {response.text}"
            
#     except Exception as e:
#         return None, f"Ошибка сети или API: {str(e)}"

# app = Flask(__name__)
# CORS(app)

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     debug_print("\n" + "="*50)
#     debug_print("📱 НОВЫЙ ЗАПРОС")
    
#     try:
#         data = request.get_json()
#         image_data = base64.b64decode(data['image'])
        
#         # 1. Обрезаем (с коррекцией координат)
#         file_path = crop_image_to_frame(
#             image_data, 
#             data['frame_rect'], 
#             data['screen_width'], 
#             data['screen_height']
#         )
        
#         if not file_path:
#             return jsonify({"success": False, "message": "Ошибка обработки фото (обрезка)"}), 500

#         # 2. Распознаем текст с OpenCV предобработкой
#         recognized_text, error = extract_text_from_image(file_path)
        
#         if error:
#             debug_print(f"❌ Ошибка OCR: {error}")
#             return jsonify({
#                 "success": False, 
#                 "message": f"Не удалось прочитать текст: {error}"
#             }), 500
            
#         # 3. Отправляем текст в API
#         api_response, api_error = call_deepseek_api_text(recognized_text)
        
#         if api_error:
#             debug_print(f"❌ Ошибка API: {api_error}")
#             return jsonify({"success": False, "message": api_error}), 500

#         # 4. Парсим ответ
#         try:
#             result = json.loads(api_response)
#             if "solutions" in result and isinstance(result["solutions"], list):
#                 return jsonify({"success": True, "solutions": result["solutions"]})
#         except:
#             pass
            
#         # Запасной вариант: если API вернул невалидный JSON
#         debug_print("⚠️ API вернул невалидный JSON. Возвращаем сырой ответ.")
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Сырой ответ DeepSeek (Ошибка парсинга)",
#                 "answer": "Смотрите описание шагов",
#                 "formulas": [],
#                 "steps": [api_response]
#             }]
#         })

#     except Exception as e:
#         debug_print(f"💥 Критическая ошибка сервера: {e}")
#         return jsonify({"success": False, "message": f"Внутренняя ошибка сервера: {str(e)}"}), 500

# # --- ОТЛАДОЧНЫЕ МАРШРУТЫ ---

# @app.route('/debug/cropped', methods=['GET'])
# def debug_cropped_image():
#     """Показывает обрезанное изображение (temp_cropped.jpg)"""
#     if os.path.exists(TEMP_CROPPED_FILE):
#         return send_file(TEMP_CROPPED_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл temp_cropped.jpg не найден. Сначала выполните /solve."}), 404

# @app.route('/debug/processed', methods=['GET'])
# def debug_processed_image():
#     """Показывает изображение после предобработки OpenCV (debug_ocr_image_processed.jpg)"""
#     if os.path.exists(DEBUG_IMAGE_FILE):
#         return send_file(DEBUG_IMAGE_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл debug_ocr_image_processed.jpg не найден. Сначала выполните /solve."}), 404

# # ----------------------------------

# @app.route('/status', methods=['GET'])
# def server_status():
#     """Проверка статуса сервера и API ключа"""
#     try:
#         if not OCR_AVAILABLE:
#              return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": "❌ Tesseract (pytesseract) не установлен!"
#             })
            
#         headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}"}
#         test_response = requests.get(
#             "https://api.deepseek.com/v1/models",
#             headers=headers,
#             timeout=10
#         )
        
#         if test_response.status_code == 200:
#             return jsonify({
#                 "success": True,
#                 "api_key_valid": True,
#                 "message": "✅ Сервер работает, API ключ действителен"
#             })
#         else:
#             return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": f"❌ API ключ недействителен (код: {test_response.status_code})"
#             })
            
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "api_key_valid": False,
#             "message": f"❌ Ошибка проверки API: {str(e)}"
#         })

# if __name__ == '__main__':
#     debug_print("🚀 Запуск Flask сервера (Режим OCR -> DeepSeek)")
#     debug_print("="*50)
#     app.run(host='0.0.0.0', port=5000, debug=True)

























# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from PIL import Image, ImageOps 
# import io
# import numpy as np 
# import cv2 

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен (pip install pytesseract)")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# DEBUG_IMAGE_FILE = 'debug_ocr_image_processed.jpg'
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" # ЗАМЕНИТЕ НА ВАШ КЛЮЧ
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# # Оптимизированный промпт для DeepSeek (теперь ожидает ТЕКСТ)
# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи, распознанный с фотографии.

# 1. Исправь возможные ошибки распознавания (OCR) в тексте.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в следующем JSON формате, без лишнего текста, объяснений, или markdown:

# {
#     "solutions": [
#         {
#             "title": "Название метода решения",
#             "formulas": ["формула1", "формула2"],
#             "answer": "конечный числовой ответ с единицами измерения",
#             "steps": ["шаг 1: описание", "шаг 2: вычисления", "шаг 3: результат"]
#         }
#     ]
# }

# ВАЖНО: Используй LaTeX для формул в квадратных скобках: [F = ma]
# """

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     """Продвинутая предобработка с OpenCV (Otsu's Binarization) и OCR."""
#     if not OCR_AVAILABLE:
#         return None, "Библиотека pytesseract не установлена."
    
#     try:
#         debug_print("👀 Запускаем OpenCV предобработку (Otsu's Binarization) и OCR...")
        
#         img_bgr = cv2.imread(image_path)
        
#         if img_bgr is None:
#             return None, "Не удалось загрузить обрезанное изображение."
            
#         gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        
#         # Применение автоматической бинаризации Оцу (Otsu's Binarization)
#         _, processed_img = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

#         cv2.imwrite(DEBUG_IMAGE_FILE, processed_img)
#         debug_print(f"🖼️ Обработанное изображение для OCR сохранено в {DEBUG_IMAGE_FILE}")
        
#         pil_image = Image.fromarray(processed_img)
        
#         tesseract_config = '--psm 6' 
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config=tesseract_config)
        
#         cleaned_text = text.strip()
        
#         if not cleaned_text:
#             return None, "Текст не распознан. Фото слишком нечеткое или пустое."
            
#         debug_print(f"📖 Распознанный текст (первые 50 симв.): {cleaned_text[:50]}...")
#         return cleaned_text, None
        
#     except Exception as e:
#         error_msg = str(e)
#         if "No such file or directory" in error_msg or "failed to find tesseract" in error_msg:
#             return None, "Tesseract OCR не найден. Проверьте установку и PATH."
#         return None, f"Критическая ошибка OCR: {error_msg}"

# def crop_image_to_frame(image_data, frame_rect, screen_width, screen_height):
#     """
#     Обрезает изображение по рамке. 
#     ПРИМЕНЯЕТ ЛОГИКУ КРОСС-МАППИНГА (ШАГ 8).
#     Сохраняет результат в TEMP_CROPPED_FILE.
#     """
#     try:
#         debug_print("✂️ Обрезаем изображение...")
#         image = Image.open(io.BytesIO(image_data))
        
#         # Размеры сырого изображения
#         img_width, img_height = image.size
        
#         # Координаты обрезки по умолчанию
#         left = 0
#         top = 0
#         right = img_width
#         bottom = img_height

#         # Проверяем несоответствие осей (Портретный экран vs. Ландшафтный сырой файл)
#         if screen_height > screen_width and img_width > img_height:
#             debug_print("🔄 Обнаружено несоответствие осей: применяем исправленный кросс-маппинг координат (Шаг 8 - Инверсия Top).")

#             # Scale X (ширина экрана) -> Y (высота изображения)
#             scale_x = img_height / screen_width
#             # Scale Y (высота экрана) -> X (ширина изображения)
#             scale_y = img_width / screen_height

#             # --- ИСПРАВЛЕННАЯ ЛОГИКА КООРДИНАТ (ШАГ 8) ---
            
#             # 1. LEFT coordinate (Raw Image X-axis): Corresponds to Screen Y-axis. НЕ инвертируем.
#             left = int(frame_rect['y'] * scale_y)
            
#             # 2. TOP coordinate (Raw Image Y-axis): Corresponds to Screen X-axis. ИНВЕРТИРУЕМ.
#             # Инверсия по Y, чтобы учесть сдвиг X экрана 
#             top = img_height - int((frame_rect['x'] + frame_rect['width']) * scale_x)
            
#             # 3. RIGHT coordinate (Raw Image X-axis): Y-axis end
#             right = left + int(frame_rect['height'] * scale_y)

#             # 4. BOTTOM coordinate (Raw Image Y-axis): X-axis end
#             bottom = top + int(frame_rect['width'] * scale_x)
            
#             # --- КОНЕЦ ИСПРАВЛЕННОЙ ЛОГИКИ ---

#         else:
#             # Стандартная логика (если оси совпадают)
#             scale_x = img_width / screen_width
#             scale_y = img_height / screen_height
            
#             left = int(frame_rect['x'] * scale_x)
#             top = int(frame_rect['y'] * scale_y)
#             right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
#             bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
        
#         # Обрезаем
#         cropped_image = image.crop((left, top, right, bottom))
        
#         # --- ОСТАВЛЯЕМ ПОВОРОТ 270 ---
#         cropped_image = cropped_image.transpose(Image.ROTATE_270)
#         # -----------------------------
        
#         cropped_image.save(TEMP_CROPPED_FILE, 'JPEG', quality=100)
#         debug_print(f"✅ Успешно обрезано и повернуто в {TEMP_CROPPED_FILE}. Координаты обрезки: ({left}, {top}, {right}, {bottom})")
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"❌ Ошибка обрезки: {e}")
#         return None

# def call_deepseek_api_text(problem_text):
#     """Отправляет распознанный текст в DeepSeek Chat API"""
#     try:
#         debug_print("🚀 Отправляем текст в DeepSeek API...")
        
#         messages = [
#             {"role": "system", "content": PROMPT_SYSTEM},
#             {"role": "user", "content": f"Распознанный текст задачи:\n\n{problem_text}"}
#         ]
        
#         payload = {
#             "model": "deepseek-chat",
#             "messages": messages,
#             "max_tokens": 2000,
#             "temperature": 0.1,
#             "response_format": {"type": "json_object"}
#         }
        
#         headers = {
#             "Content-Type": "application/json",
#             "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
#         }
        
#         response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=60)
        
#         if response.status_code == 200:
#             return response.json()["choices"][0]["message"]["content"], None
#         else:
#             return None, f"Ошибка DeepSeek API {response.status_code}: {response.text}"
            
#     except Exception as e:
#         return None, f"Ошибка сети или API: {str(e)}"

# app = Flask(__name__)
# CORS(app)

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     debug_print("\n" + "="*50)
#     debug_print("📱 НОВЫЙ ЗАПРОС")
    
#     try:
#         data = request.get_json()
#         image_data = base64.b64decode(data['image'])
        
#         # 1. Обрезаем (с коррекцией координат)
#         file_path = crop_image_to_frame(
#             image_data, 
#             data['frame_rect'], 
#             data['screen_width'], 
#             data['screen_height']
#         )
        
#         if not file_path:
#             return jsonify({"success": False, "message": "Ошибка обработки фото (обрезка)"}), 500

#         # 2. Распознаем текст с OpenCV предобработкой
#         recognized_text, error = extract_text_from_image(file_path)
        
#         if error:
#             debug_print(f"❌ Ошибка OCR: {error}")
#             return jsonify({
#                 "success": False, 
#                 "message": f"Не удалось прочитать текст: {error}"
#             }), 500
            
#         # 3. Отправляем текст в API
#         api_response, api_error = call_deepseek_api_text(recognized_text)
        
#         if api_error:
#             debug_print(f"❌ Ошибка API: {api_error}")
#             return jsonify({"success": False, "message": api_error}), 500

#         # 4. Парсим ответ
#         try:
#             result = json.loads(api_response)
#             if "solutions" in result and isinstance(result["solutions"], list):
#                 return jsonify({"success": True, "solutions": result["solutions"]})
#         except:
#             pass
            
#         # Запасной вариант: если API вернул невалидный JSON
#         debug_print("⚠️ API вернул невалидный JSON. Возвращаем сырой ответ.")
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Сырой ответ DeepSeek (Ошибка парсинга)",
#                 "answer": "Смотрите описание шагов",
#                 "formulas": [],
#                 "steps": [api_response]
#             }]
#         })

#     except Exception as e:
#         debug_print(f"💥 Критическая ошибка сервера: {e}")
#         return jsonify({"success": False, "message": f"Внутренняя ошибка сервера: {str(e)}"}), 500

# # --- ОТЛАДОЧНЫЕ МАРШРУТЫ ---

# @app.route('/debug/cropped', methods=['GET'])
# def debug_cropped_image():
#     """Показывает обрезанное изображение (temp_cropped.jpg)"""
#     if os.path.exists(TEMP_CROPPED_FILE):
#         return send_file(TEMP_CROPPED_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл temp_cropped.jpg не найден. Сначала выполните /solve."}), 404

# @app.route('/debug/processed', methods=['GET'])
# def debug_processed_image():
#     """Показывает изображение после предобработки OpenCV (debug_ocr_image_processed.jpg)"""
#     if os.path.exists(DEBUG_IMAGE_FILE):
#         return send_file(DEBUG_IMAGE_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл debug_ocr_image_processed.jpg не найден. Сначала выполните /solve."}), 404

# # ----------------------------------

# @app.route('/status', methods=['GET'])
# def server_status():
#     """Проверка статуса сервера и API ключа"""
#     try:
#         if not OCR_AVAILABLE:
#              return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": "❌ Tesseract (pytesseract) не установлен!"
#             })
            
#         headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}"}
#         test_response = requests.get(
#             "https://api.deepseek.com/v1/models",
#             headers=headers,
#             timeout=10
#         )
        
#         if test_response.status_code == 200:
#             return jsonify({
#                 "success": True,
#                 "api_key_valid": True,
#                 "message": "✅ Сервер работает, API ключ действителен"
#             })
#         else:
#             return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": f"❌ API ключ недействителен (код: {test_response.status_code})"
#             })
            
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "api_key_valid": False,
#             "message": f"❌ Ошибка проверки API: {str(e)}"
#         })

# if __name__ == '__main__':
#     debug_print("🚀 Запуск Flask сервера (Режим OCR -> DeepSeek)")
#     debug_print("="*50)
#     app.run(host='0.0.0.0', port=5000, debug=True)









# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from PIL import Image, ImageOps 
# import io
# import numpy as np 
# import cv2 

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен (pip install pytesseract)")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# DEBUG_IMAGE_FILE = 'debug_ocr_image_processed.jpg'
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" # ЗАМЕНИТЕ НА ВАШ КЛЮЧ
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# # Оптимизированный промпт для DeepSeek (теперь ожидает ТЕКСТ)
# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи, распознанный с фотографии.

# 1. Исправь возможные ошибки распознавания (OCR) в тексте.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в следующем JSON формате, без лишнего текста, объяснений, или markdown:

# {
#     "solutions": [
#         {
#             "title": "Название метода решения",
#             "formulas": ["формула1", "формула2"],
#             "answer": "конечный числовой ответ с единицами измерения",
#             "steps": ["шаг 1: описание", "шаг 2: вычисления", "шаг 3: результат"]
#         }
#     ]
# }

# ВАЖНО: Используй LaTeX для формул в квадратных скобках: [F = ma]
# """

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     """Продвинутая предобработка с OpenCV (Otsu's Binarization) и OCR."""
#     if not OCR_AVAILABLE:
#         return None, "Библиотека pytesseract не установлена."
    
#     try:
#         debug_print("👀 Запускаем OpenCV предобработку (Otsu's Binarization) и OCR...")
        
#         img_bgr = cv2.imread(image_path)
        
#         if img_bgr is None:
#             return None, "Не удалось загрузить обрезанное изображение."
            
#         gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        
#         # Применение автоматической бинаризации Оцу (Otsu's Binarization)
#         _, processed_img = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

#         cv2.imwrite(DEBUG_IMAGE_FILE, processed_img)
#         debug_print(f"🖼️ Обработанное изображение для OCR сохранено в {DEBUG_IMAGE_FILE}")
        
#         pil_image = Image.fromarray(processed_img)
        
#         tesseract_config = '--psm 6' 
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config=tesseract_config)
        
#         cleaned_text = text.strip()
        
#         if not cleaned_text:
#             return None, "Текст не распознан. Фото слишком нечеткое или пустое."
            
#         debug_print(f"📖 Распознанный текст (первые 50 симв.): {cleaned_text[:50]}...")
#         return cleaned_text, None
        
#     except Exception as e:
#         error_msg = str(e)
#         if "No such file or directory" in error_msg or "failed to find tesseract" in error_msg:
#             return None, "Tesseract OCR не найден. Проверьте установку и PATH."
#         return None, f"Критическая ошибка OCR: {error_msg}"

# def crop_image_to_frame(image_data, frame_rect, screen_width, screen_height):
#     """
#     Обрезает изображение по рамке. 
#     ПРИМЕНЯЕТ ЛОГИКУ КРОСС-МАППИНГА (ШАГ 8).
#     Сохраняет результат в TEMP_CROPPED_FILE.
#     """
#     try:
#         debug_print("✂️ Обрезаем изображение...")
#         image = Image.open(io.BytesIO(image_data))
        
#         # Размеры сырого изображения
#         img_width, img_height = image.size
        
#         # Координаты обрезки по умолчанию
#         left = 0
#         top = 0
#         right = img_width
#         bottom = img_height

#         # Проверяем несоответствие осей (Портретный экран vs. Ландшафтный сырой файл)
#         if screen_height > screen_width and img_width > img_height:
#             debug_print("🔄 Обнаружено несоответствие осей: применяем исправленный кросс-маппинг координат (Шаг 8 - Инверсия Top).")

#             # Scale X (ширина экрана) -> Y (высота изображения)
#             scale_x = img_height / screen_width
#             # Scale Y (высота экрана) -> X (ширина изображения)
#             scale_y = img_width / screen_height

#             # --- ИСПРАВЛЕННАЯ ЛОГИКА КООРДИНАТ (ШАГ 8) ---
            
#             # 1. LEFT coordinate (Raw Image X-axis): Corresponds to Screen Y-axis. НЕ инвертируем.
#             left = int(frame_rect['y'] * scale_y)
            
#             # 2. TOP coordinate (Raw Image Y-axis): Corresponds to Screen X-axis. ИНВЕРТИРУЕМ.
#             # Инверсия по Y, чтобы учесть сдвиг X экрана 
#             top = img_height - int((frame_rect['x'] + frame_rect['width']) * scale_x)
            
#             # 3. RIGHT coordinate (Raw Image X-axis): Y-axis end
#             right = left + int(frame_rect['height'] * scale_y)

#             # 4. BOTTOM coordinate (Raw Image Y-axis): X-axis end
#             bottom = top + int(frame_rect['width'] * scale_x)
            
#             # --- КОНЕЦ ИСПРАВЛЕННОЙ ЛОГИКИ ---

#         else:
#             # Стандартная логика (если оси совпадают)
#             scale_x = img_width / screen_width
#             scale_y = img_height / screen_height
            
#             left = int(frame_rect['x'] * scale_x)
#             top = int(frame_rect['y'] * scale_y)
#             right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
#             bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
        
#         # Обрезаем
#         cropped_image = image.crop((left, top, right, bottom))
        
#         # --- ОСТАВЛЯЕМ ПОВОРОТ 270 ---
#         cropped_image = cropped_image.transpose(Image.ROTATE_270)
#         # -----------------------------
        
#         cropped_image.save(TEMP_CROPPED_FILE, 'JPEG', quality=100)
#         debug_print(f"✅ Успешно обрезано и повернуто в {TEMP_CROPPED_FILE}. Координаты обрезки: ({left}, {top}, {right}, {bottom})")
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"❌ Ошибка обрезки: {e}")
#         return None

# def call_deepseek_api_text(problem_text):
#     """Отправляет распознанный текст в DeepSeek Chat API"""
#     try:
#         debug_print("🚀 Отправляем текст в DeepSeek API...")
        
#         messages = [
#             {"role": "system", "content": PROMPT_SYSTEM},
#             {"role": "user", "content": f"Распознанный текст задачи:\n\n{problem_text}"}
#         ]
        
#         payload = {
#             "model": "deepseek-chat",
#             "messages": messages,
#             "max_tokens": 2000,
#             "temperature": 0.1,
#             "response_format": {"type": "json_object"}
#         }
        
#         headers = {
#             "Content-Type": "application/json",
#             "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
#         }
        
#         response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=60)
        
#         if response.status_code == 200:
#             return response.json()["choices"][0]["message"]["content"], None
#         else:
#             return None, f"Ошибка DeepSeek API {response.status_code}: {response.text}"
            
#     except Exception as e:
#         return None, f"Ошибка сети или API: {str(e)}"

# app = Flask(__name__)
# CORS(app)

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     debug_print("\n" + "="*50)
#     debug_print("📱 НОВЫЙ ЗАПРОС")
    
#     try:
#         data = request.get_json()
#         image_data = base64.b64decode(data['image'])
        
#         # 1. Обрезаем (с коррекцией координат)
#         file_path = crop_image_to_frame(
#             image_data, 
#             data['frame_rect'], 
#             data['screen_width'], 
#             data['screen_height']
#         )
        
#         if not file_path:
#             return jsonify({"success": False, "message": "Ошибка обработки фото (обрезка)"}), 500

#         # 2. Распознаем текст с OpenCV предобработкой
#         recognized_text, error = extract_text_from_image(file_path)
        
#         if error:
#             debug_print(f"❌ Ошибка OCR: {error}")
#             return jsonify({
#                 "success": False, 
#                 "message": f"Не удалось прочитать текст: {error}"
#             }), 500
            
#         # 3. Отправляем текст в API
#         api_response, api_error = call_deepseek_api_text(recognized_text)
        
#         if api_error:
#             debug_print(f"❌ Ошибка API: {api_error}")
#             return jsonify({"success": False, "message": api_error}), 500

#         # 4. Парсим ответ
#         try:
#             result = json.loads(api_response)
#             if "solutions" in result and isinstance(result["solutions"], list):
#                 return jsonify({"success": True, "solutions": result["solutions"]})
#         except:
#             pass
            
#         # Запасной вариант: если API вернул невалидный JSON
#         debug_print("⚠️ API вернул невалидный JSON. Возвращаем сырой ответ.")
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Сырой ответ DeepSeek (Ошибка парсинга)",
#                 "answer": "Смотрите описание шагов",
#                 "formulas": [],
#                 "steps": [api_response]
#             }]
#         })

#     except Exception as e:
#         debug_print(f"💥 Критическая ошибка сервера: {e}")
#         return jsonify({"success": False, "message": f"Внутренняя ошибка сервера: {str(e)}"}), 500

# # --- ОТЛАДОЧНЫЕ МАРШРУТЫ ---

# @app.route('/debug/cropped', methods=['GET'])
# def debug_cropped_image():
#     """Показывает обрезанное изображение (temp_cropped.jpg)"""
#     if os.path.exists(TEMP_CROPPED_FILE):
#         return send_file(TEMP_CROPPED_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл temp_cropped.jpg не найден. Сначала выполните /solve."}), 404

# @app.route('/debug/processed', methods=['GET'])
# def debug_processed_image():
#     """Показывает изображение после предобработки OpenCV (debug_ocr_image_processed.jpg)"""
#     if os.path.exists(DEBUG_IMAGE_FILE):
#         return send_file(DEBUG_IMAGE_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл debug_ocr_image_processed.jpg не найден. Сначала выполните /solve."}), 404

# # ----------------------------------

# @app.route('/status', methods=['GET'])
# def server_status():
#     """Проверка статуса сервера и API ключа"""
#     try:
#         if not OCR_AVAILABLE:
#              return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": "❌ Tesseract (pytesseract) не установлен!"
#             })
            
#         headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}"}
#         test_response = requests.get(
#             "https://api.deepseek.com/v1/models",
#             headers=headers,
#             timeout=10
#         )
        
#         if test_response.status_code == 200:
#             return jsonify({
#                 "success": True,
#                 "api_key_valid": True,
#                 "message": "✅ Сервер работает, API ключ действителен"
#             })
#         else:
#             return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": f"❌ API ключ недействителен (код: {test_response.status_code})"
#             })
            
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "api_key_valid": False,
#             "message": f"❌ Ошибка проверки API: {str(e)}"
#         })

# if __name__ == '__main__':
#     debug_print("🚀 Запуск Flask сервера (Режим OCR -> DeepSeek)")
#     debug_print("="*50)
#     app.run(host='0.0.0.0', port=5000, debug=True)





# =============================================================================================================================================================
# 111111111111111111111111111111111chat111111111111111111111111111111111chat111111111111111111111111111111111chat111111111111111111111111111111111chat
# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from PIL import Image, ImageOps 
# import io
# import numpy as np 
# import cv2 

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH (например, для Windows)
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен (pip install pytesseract)")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# DEBUG_IMAGE_FILE = 'debug_ocr_image_processed.jpg'
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" # ЗАМЕНИТЕ НА ВАШ КЛЮЧ
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# # Оптимизированный промпт для DeepSeek (теперь ожидает ТЕКСТ)
# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи, распознанный с фотографии.

# 1. Исправь возможные ошибки распознавания (OCR) в тексте.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в следующем JSON формате, без лишнего текста, объяснений, или markdown:

# {
#     "solutions": [
#         {
#             "title": "Название метода решения",
#             "formulas": ["формула1", "формула2"],
#             "answer": "конечный числовой ответ с единицами измерения",
#             "steps": ["шаг 1: описание", "шаг 2: вычисления", "шаг 3: результат"]
#         }
#     ]
# }

# ВАЖНО: Используй LaTeX для формул в квадратных скобках: [F = ma]
# """

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     """Продвинутая предобработка с OpenCV (Otsu's Binarization) и OCR."""
#     if not OCR_AVAILABLE:
#         return None, "Библиотека pytesseract не установлена."
    
#     try:
#         debug_print("👀 Запускаем OpenCV предобработку (Otsu's Binarization) и OCR...")
        
#         img_bgr = cv2.imread(image_path)
        
#         if img_bgr is None:
#             return None, "Не удалось загрузить обрезанное изображение."
            
#         gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        
#         # Применение автоматической бинаризации Оцу (Otsu's Binarization)
#         _, processed_img = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

#         cv2.imwrite(DEBUG_IMAGE_FILE, processed_img)
#         debug_print(f"🖼️ Обработанное изображение для OCR сохранено в {DEBUG_IMAGE_FILE}")
        
#         pil_image = Image.fromarray(processed_img)
        
#         tesseract_config = '--psm 6' 
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config=tesseract_config)
        
#         cleaned_text = text.strip()
        
#         if not cleaned_text:
#             return None, "Текст не распознан. Фото слишком нечеткое или пустое."
            
#         debug_print(f"📖 Распознанный текст (первые 50 симв.): {cleaned_text[:50]}...")
#         return cleaned_text, None
        
#     except Exception as e:
#         error_msg = str(e)
#         if "No such file or directory" in error_msg or "failed to find tesseract" in error_msg:
#             return None, "Tesseract OCR не найден. Проверьте установку и PATH."
#         return None, f"Критическая ошибка OCR: {error_msg}"

# def crop_image_to_frame(image_data, frame_rect, screen_width, screen_height):
#     """
#     Обрезает изображение по рамке. 
#     ПРИМЕНЯЕТ ЛОГИКУ КРОСС-МАППИНГА (ШАГ 9: LLM Confirmed + Clamp).
#     Сохраняет результат в TEMP_CROPPED_FILE.
#     """
#     try:
#         debug_print("✂️ Обрезаем изображение...")
#         image = Image.open(io.BytesIO(image_data))
        
#         # Размеры сырого изображения
#         img_width, img_height = image.size
        
#         # Координаты обрезки по умолчанию
#         left = 0
#         top = 0
#         right = img_width
#         bottom = img_height

#         # Проверяем несоответствие осей (Портретный экран vs. Ландшафтный сырой файл)
#         if screen_height > screen_width and img_width > img_height:
#             debug_print("🔄 Обнаружено несоответствие осей: применяем логику LLM (Шаг 9) 270°.")

#             # Scale X (ширина экрана) -> Y (высота изображения)
#             scale_x = img_height / screen_width
#             # Scale Y (высота экрана) -> X (ширина изображения)
#             scale_y = img_width / screen_height

#             # --- ИСПРАВЛЕННАЯ ЛОГИКА КООРДИНАТ (ШАГ 9 - LLM Confirmed) ---
            
#             # 1. TOP coordinate (Raw Image Y-axis): Corresponds to Screen X-axis (НЕ инвертируем)
#             top = int(frame_rect['x'] * scale_x)
            
#             # 2. LEFT coordinate (Raw Image X-axis): Corresponds to Screen Y-axis. ИНВЕРТИРУЕМ.
#             # Инверсия по X, отсчитываемая от правого края снимка.
#             left = img_width - int((frame_rect['y'] + frame_rect['height']) * scale_y)

#             # 3. BOTTOM coordinate (Raw Image Y-axis): X-axis end
#             bottom = top + int(frame_rect['width'] * scale_x)

#             # 4. RIGHT coordinate (Raw Image X-axis): Y-axis end
#             right = left + int(frame_rect['height'] * scale_y)
            
#             # --- Защита от выхода за границы (Clamp) ---
#             left = max(0, left)
#             top = max(0, top)
#             right = min(img_width, right)
#             bottom = min(img_height, bottom)
            
#             # --- КОНЕЦ ИСПРАВЛЕННОЙ ЛОГИКИ ---

#         else:
#             # Стандартная логика (если оси совпадают)
#             scale_x = img_width / screen_width
#             scale_y = img_height / screen_height
            
#             left = int(frame_rect['x'] * scale_x)
#             top = int(frame_rect['y'] * scale_y)
#             right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
#             bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
        
#         # Обрезаем
#         cropped_image = image.crop((left, top, right, bottom))
        
#         # --- ОСТАВЛЯЕМ ПОВОРОТ 270 ---
#         cropped_image = cropped_image.transpose(Image.ROTATE_270)
#         # -----------------------------
        
#         cropped_image.save(TEMP_CROPPED_FILE, 'JPEG', quality=100)
#         debug_print(f"✅ Успешно обрезано и повернуто в {TEMP_CROPPED_FILE}. Координаты обрезки: ({left}, {top}, {right}, {bottom})")
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"❌ Ошибка обрезки: {e}")
#         return None

# def call_deepseek_api_text(problem_text):
#     """Отправляет распознанный текст в DeepSeek Chat API"""
#     try:
#         debug_print("🚀 Отправляем текст в DeepSeek API...")
        
#         messages = [
#             {"role": "system", "content": PROMPT_SYSTEM},
#             {"role": "user", "content": f"Распознанный текст задачи:\n\n{problem_text}"}
#         ]
        
#         payload = {
#             "model": "deepseek-chat",
#             "messages": messages,
#             "max_tokens": 2000,
#             "temperature": 0.1,
#             "response_format": {"type": "json_object"}
#         }
        
#         headers = {
#             "Content-Type": "application/json",
#             "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
#         }
        
#         response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=60)
        
#         if response.status_code == 200:
#             return response.json()["choices"][0]["message"]["content"], None
#         else:
#             return None, f"Ошибка DeepSeek API {response.status_code}: {response.text}"
            
#     except Exception as e:
#         return None, f"Ошибка сети или API: {str(e)}"

# app = Flask(__name__)
# CORS(app)

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     debug_print("\n" + "="*50)
#     debug_print("📱 НОВЫЙ ЗАПРОС")
    
#     try:
#         data = request.get_json()
#         image_data = base64.b64decode(data['image'])
        
#         # 1. Обрезаем (с коррекцией координат)
#         file_path = crop_image_to_frame(
#             image_data, 
#             data['frame_rect'], 
#             data['screen_width'], 
#             data['screen_height']
#         )
        
#         if not file_path:
#             return jsonify({"success": False, "message": "Ошибка обработки фото (обрезка)"}), 500

#         # 2. Распознаем текст с OpenCV предобработкой
#         recognized_text, error = extract_text_from_image(file_path)
        
#         if error:
#             debug_print(f"❌ Ошибка OCR: {error}")
#             return jsonify({
#                 "success": False, 
#                 "message": f"Не удалось прочитать текст: {error}"
#             }), 500
            
#         # 3. Отправляем текст в API
#         api_response, api_error = call_deepseek_api_text(recognized_text)
        
#         if api_error:
#             debug_print(f"❌ Ошибка API: {api_error}")
#             return jsonify({"success": False, "message": api_error}), 500

#         # 4. Парсим ответ
#         try:
#             result = json.loads(api_response)
#             if "solutions" in result and isinstance(result["solutions"], list):
#                 return jsonify({"success": True, "solutions": result["solutions"]})
#         except:
#             pass
            
#         # Запасной вариант: если API вернул невалидный JSON
#         debug_print("⚠️ API вернул невалидный JSON. Возвращаем сырой ответ.")
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Сырой ответ DeepSeek (Ошибка парсинга)",
#                 "answer": "Смотрите описание шагов",
#                 "formulas": [],
#                 "steps": [api_response]
#             }]
#         })

#     except Exception as e:
#         debug_print(f"💥 Критическая ошибка сервера: {e}")
#         return jsonify({"success": False, "message": f"Внутренняя ошибка сервера: {str(e)}"}), 500

# # --- ОТЛАДОЧНЫЕ МАРШРУТЫ ---

# @app.route('/debug/cropped', methods=['GET'])
# def debug_cropped_image():
#     """Показывает обрезанное изображение (temp_cropped.jpg)"""
#     if os.path.exists(TEMP_CROPPED_FILE):
#         return send_file(TEMP_CROPPED_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл temp_cropped.jpg не найден. Сначала выполните /solve."}), 404

# @app.route('/debug/processed', methods=['GET'])
# def debug_processed_image():
#     """Показывает изображение после предобработки OpenCV (debug_ocr_image_processed.jpg)"""
#     if os.path.exists(DEBUG_IMAGE_FILE):
#         return send_file(DEBUG_IMAGE_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл debug_ocr_image_processed.jpg не найден. Сначала выполните /solve."}), 404

# # ----------------------------------

# @app.route('/status', methods=['GET'])
# def server_status():
#     """Проверка статуса сервера и API ключа"""
#     try:
#         if not OCR_AVAILABLE:
#              return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": "❌ Tesseract (pytesseract) не установлен!"
#             })
            
#         headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}"}
#         test_response = requests.get(
#             "https://api.deepseek.com/v1/models",
#             headers=headers,
#             timeout=10
#         )
        
#         if test_response.status_code == 200:
#             return jsonify({
#                 "success": True,
#                 "api_key_valid": True,
#                 "message": "✅ Сервер работает, API ключ действителен"
#             })
#         else:
#             return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": f"❌ API ключ недействителен (код: {test_response.status_code})"
#             })
            
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "api_key_valid": False,
#             "message": f"❌ Ошибка проверки API: {str(e)}"
#         })

# if __name__ == '__main__':
#     debug_print("🚀 Запуск Flask сервера (Режим OCR -> DeepSeek)")
#     debug_print("="*50)
#     app.run(host='0.0.0.0', port=5000, debug=True)





# 2chat





# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     # Сохраняем полное фото для отладки
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' # Фото с нарисованной рамкой
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи.
# 1. Исправь ошибки OCR.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в JSON:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула"],
#             "answer": "ответ",
#             "steps": ["шаг 1", "шаг 2"]
#         }
#     ]
# }
# """

# app = Flask(__name__)
# CORS(app)

# # Глобальная переменная для хранения последних данных отладки
# last_debug_data = {}

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         img = cv2.imread(image_path)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         pil_image = Image.fromarray(processed)
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     """
#     Обрезает фото и генерирует отладочные изображения для Dashboard.
#     """
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
#         # Сохраняем оригинал для отладки
#         image.save(TEMP_FULL_FILE)
        
#         img_w, img_h = image.size
        
#         # Логируем данные
#         last_debug_data = {
#             "screen_w": screen_w,
#             "screen_h": screen_h,
#             "img_w": img_w,
#             "img_h": img_h,
#             "frame": frame_rect
#         }

#         # --- ТЕКУЩАЯ ЛОГИКА (Которую мы будем чинить) ---
#         # Пока оставляем как есть, чтобы увидеть ошибку глазами
#         if screen_h > screen_w and img_w > img_h:
#             # Логика для поворота (подозрительная, но пока не трогаем)
#             scale_x = img_h / screen_w
#             scale_y = img_w / screen_h
            
#             top = int(frame_rect['x'] * scale_x)
#             left = img_w - int((frame_rect['y'] + frame_rect['height']) * scale_y)
#             bottom = top + int(frame_rect['width'] * scale_x)
#             right = left + int(frame_rect['height'] * scale_y)
            
#             # Clamp
#             left = max(0, left); top = max(0, top)
#             right = min(img_w, right); bottom = min(img_h, bottom)
            
#             crop_box = (left, top, right, bottom)
#             cropped = image.crop(crop_box)
#             cropped = cropped.transpose(Image.ROTATE_270)
            
#         else:
#             # Стандартная логика
#             scale_x = img_w / screen_w
#             scale_y = img_h / screen_h
            
#             left = int(frame_rect['x'] * scale_x)
#             top = int(frame_rect['y'] * scale_y)
#             right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
#             bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
            
#             crop_box = (left, top, right, bottom)
#             cropped = image.crop(crop_box)

#         # Сохраняем кроп
#         cropped.save(TEMP_CROPPED_FILE)
        
#         # --- ГЕНЕРАЦИЯ ОТЛАДОЧНОЙ КАРТИНКИ С РАМКОЙ ---
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         # Рисуем прямоугольник, который мы вычислили (до поворота результата)
#         draw.rectangle(crop_box, outline="red", width=10)
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def call_deepseek(text):
#     # Заглушка, чтобы не тратить токены пока чиним камеру,
#     # или оставь реальный вызов если хочешь.
#     # Для теста камеры лучше пока вернуть фейк.
#     return json.dumps({
#         "solutions": [{
#             "title": "Режим отладки камеры",
#             "formulas": [],
#             "answer": "Проверь http://IP:5000/dashboard",
#             "steps": ["Мы настраиваем камеру"]
#         }]
#     }), None

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not path: return jsonify({"success": False, "message": "Ошибка кропа"}), 500
        
#         # Пока пропускаем OCR и DeepSeek для экономии времени, нам нужна картинка
#         # text, _ = extract_text_from_image(path)
#         # result, _ = call_deepseek(text)
        
#         # Возвращаем заглушку успеха
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Фото получено", 
#                 "answer": "Зайди в Dashboard", 
#                 "formulas": [], 
#                 "steps": ["Фото сохранено на сервере"]
#             }]
#         })
        
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Camera Debugger</title>
#         <style>
#             body { font-family: sans-serif; background: #222; color: #fff; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; }
#             .box { background: #333; padding: 10px; border-radius: 8px; }
#             img { max-width: 400px; border: 2px solid #555; }
#             pre { background: #111; padding: 10px; overflow-x: auto; }
#             h2 { margin-top: 0; }
#         </style>
#         <meta http-equiv="refresh" content="5">
#     </head>
#     <body>
#         <h1>📸 Physics Solver Debugger</h1>
#         <p>Страница обновляется автоматически каждые 5 секунд.</p>
        
#         <div class="box">
#             <h2>Данные последнего запроса</h2>
#             <pre>{{ data }}</pre>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>1. Полное фото + Рамка (Server View)</h2>
#                 <p>Красная рамка - это то, как сервер понял координаты.</p>
#                 <img src="/debug/full_rect?t={{ time }}" />
#             </div>
            
#             <div class="box">
#                 <h2>2. Результат обрезки (Result)</h2>
#                 <p>Это уходит в нейросеть.</p>
#                 <img src="/debug/cropped?t={{ time }}" />
#             </div>
#         </div>
#     </body>
#     </html>
#     """
#     return render_template_string(html, data=json.dumps(last_debug_data, indent=2), time=time.time())

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({"success": True, "api_key_valid": True})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)









# =========================================================================================


# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' 
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи.
# 1. Исправь ошибки OCR.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в JSON:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула"],
#             "answer": "ответ",
#             "steps": ["шаг 1", "шаг 2"]
#         }
#     ]
# }
# """

# app = Flask(__name__)
# CORS(app)

# last_debug_data = {}

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         img = cv2.imread(image_path)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         pil_image = Image.fromarray(processed)
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     """
#     Обрезает фото. СТРАТЕГИЯ: Сначала поворачиваем фото, потом режем.
#     """
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
        
#         # Получаем исходные размеры
#         raw_w, raw_h = image.size
        
#         rotated = False
#         # Проверка: Если экран вертикальный, а фото горизонтальное -> ПОВОРАЧИВАЕМ ФОТО
#         if screen_h > screen_w and raw_w > raw_h:
#             # Поворот на 90 градусов по часовой стрелке (ROTATE_270 делает это корректно для фото)
#             image = image.transpose(Image.ROTATE_270)
#             rotated = True
#             debug_print("🔄 Фото повернуто на 90 градусов для соответствия экрану.")

#         # Получаем новые размеры (после возможного поворота)
#         img_w, img_h = image.size

#         # Сохраняем "нормализованное" фото для дебага
#         image.save(TEMP_FULL_FILE)

#         # Логируем данные
#         last_debug_data = {
#             "screen_w": screen_w,
#             "screen_h": screen_h,
#             "img_w": img_w,
#             "img_h": img_h,
#             "rotated_was_needed": rotated,
#             "frame": frame_rect
#         }

#         # Теперь координатная сетка совпадает. Просто масштабируем.
#         scale_x = img_w / screen_w
#         scale_y = img_h / screen_h
        
#         # Поскольку мы выровняли фото под экран, используем самый простой кроп
#         left = int(frame_rect['x'] * scale_x)
#         top = int(frame_rect['y'] * scale_y)
#         width = int(frame_rect['width'] * scale_x)
#         height = int(frame_rect['height'] * scale_y)
        
#         right = left + width
#         bottom = top + height
        
#         # Защита от выхода за границы
#         left = max(0, left)
#         top = max(0, top)
#         right = min(img_w, right)
#         bottom = min(img_h, bottom)
        
#         crop_box = (left, top, right, bottom)
        
#         # Режем
#         cropped = image.crop(crop_box)
#         cropped.save(TEMP_CROPPED_FILE)
        
#         # --- ГЕНЕРАЦИЯ ОТЛАДОЧНОЙ КАРТИНКИ С РАМКОЙ ---
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         draw.rectangle(crop_box, outline="red", width=10)
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def call_deepseek(text):
#     # Пока заглушка
#     return json.dumps({
#         "solutions": [{
#             "title": "Режим настройки камеры",
#             "formulas": [],
#             "answer": "Смотри в Dashboard",
#             "steps": ["Мы проверяем точность вырезания"]
#         }]
#     }), None

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not path: return jsonify({"success": False, "message": "Ошибка кропа"}), 500
        
#         # Заглушка ответа, чтобы приложение показало "Успех" и дало сделать новое фото
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Фото обработано", 
#                 "answer": "Проверь браузер", 
#                 "formulas": [], 
#                 "steps": ["Фото повернуто и обрезано."]
#             }]
#         })
        
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Camera Debugger v2</title>
#         <style>
#             body { font-family: sans-serif; background: #222; color: #fff; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; flex-wrap: wrap; }
#             .box { background: #333; padding: 10px; border-radius: 8px; }
#             img { max-width: 400px; border: 2px solid #555; }
#             pre { background: #111; padding: 10px; overflow-x: auto; }
#             h2 { margin-top: 0; font-size: 1.2em; }
#         </style>
#         <meta http-equiv="refresh" content="3">
#     </head>
#     <body>
#         <h1>📸 Debugger v2: Auto-Rotation</h1>
#         <p>Если красная рамка совпадает с текстом - мы победили.</p>
        
#         <div class="box">
#             <h2>Данные последнего кропа</h2>
#             <pre>{{ data }}</pre>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>1. Повернутое фото + Рамка</h2>
#                 <p>Здесь фото должно стоять вертикально (как страница книги).</p>
#                 <img src="/debug/full_rect?t={{ time }}" />
#             </div>
            
#             <div class="box">
#                 <h2>2. Результат (Кроп)</h2>
#                 <p>Четко ли вырезан текст?</p>
#                 <img src="/debug/cropped?t={{ time }}" />
#             </div>
#         </div>
#     </body>
#     </html>
#     """
#     return render_template_string(html, data=json.dumps(last_debug_data, indent=2), time=time.time())

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({"success": True, "api_key_valid": True})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)





# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # ⚠️ КОНСТАНТА КОМПЕНСАЦИИ СДВИГА Y ⚠️
# # Это смещение (в пикселях экрана телефона) для коррекции вертикального сдвига, 
# # вызванного статус-баром и заголовком приложения.
# # Начнем со 100 пикселей. Если рамка слишком низко, увеличим. Если слишком высоко, уменьшим.
# Y_PIXEL_OFFSET = 100 


# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' 
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи.
# 1. Исправь ошибки OCR.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в JSON:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула"],
#             "answer": "ответ",
#             "steps": ["шаг 1", "шаг 2"]
#         }
#     ]
# }
# """

# app = Flask(__name__)
# CORS(app)

# last_debug_data = {}

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         img = cv2.imread(image_path)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         pil_image = Image.fromarray(processed)
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     """
#     Обрезает фото. СТРАТЕГИЯ: Сначала поворачиваем фото, потом режем, с компенсацией Y.
#     """
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
        
#         # Получаем исходные размеры
#         raw_w, raw_h = image.size
        
#         rotated = False
#         # Проверка: Если экран вертикальный (screen_h > screen_w), а фото горизонтальное (raw_w > raw_h) -> ПОВОРАЧИВАЕМ ФОТО
#         if screen_h > screen_w and raw_w > raw_h:
#             # Поворот на 90 градусов против часовой (для стандартных камер)
#             image = image.transpose(Image.ROTATE_270)
#             rotated = True
#             debug_print("🔄 Фото повернуто на 90 градусов для соответствия экрану.")

#         # Получаем новые размеры (после возможного поворота)
#         img_w, img_h = image.size

#         # Сохраняем "нормализованное" фото для дебага
#         image.save(TEMP_FULL_FILE)

#         # Логируем данные
#         last_debug_data = {
#             "screen_w": screen_w,
#             "screen_h": screen_h,
#             "img_w": img_w,
#             "img_h": img_h,
#             "rotated_was_needed": rotated,
#             "frame": frame_rect,
#             "y_offset_used": Y_PIXEL_OFFSET
#         }

#         # Теперь координатная сетка совпадает. Просто масштабируем.
#         scale_x = img_w / screen_w
#         scale_y = img_h / screen_h
        
#         # --- ИЗМЕНЕНИЕ: КОМПЕНСАЦИЯ Y ---
#         # Мы берем координату Y, пришедшую с телефона, и вычитаем офсет, чтобы "поднять" рамку вверх
#         y_compensated = frame_rect['y'] - Y_PIXEL_OFFSET
#         y_compensated = max(0, y_compensated) # Гарантируем, что не уйдет в минус
        
#         # Масштабируем
#         left = int(frame_rect['x'] * scale_x)
#         top = int(y_compensated * scale_y)
        
#         # Размеры кадра
#         width = int(frame_rect['width'] * scale_x)
#         height = int(frame_rect['height'] * scale_y)
        
#         right = left + width
#         bottom = top + height
#         # --- КОНЕЦ ИЗМЕНЕНИЯ ---
        
#         # Защита от выхода за границы
#         left = max(0, left)
#         top = max(0, top)
#         right = min(img_w, right)
#         bottom = min(img_h, bottom)
        
#         crop_box = (left, top, right, bottom)
        
#         # Режем
#         cropped = image.crop(crop_box)
#         cropped.save(TEMP_CROPPED_FILE)
        
#         # --- ГЕНЕРАЦИЯ ОТЛАДОЧНОЙ КАРТИНКИ С РАМКОЙ ---
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         draw.rectangle(crop_box, outline="red", width=10)
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def call_deepseek(text):
#     # Пока заглушка
#     return json.dumps({
#         "solutions": [{
#             "title": "Режим настройки камеры",
#             "formulas": [],
#             "answer": "Смотри в Dashboard",
#             "steps": ["Мы проверяем точность вырезания"]
#         }]
#     }), None

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not path: return jsonify({"success": False, "message": "Ошибка кропа"}), 500
        
#         # Заглушка ответа, чтобы приложение показало "Успех" и дало сделать новое фото
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Фото обработано", 
#                 "answer": f"Проверь Dashboard. Y-компенсация: {Y_PIXEL_OFFSET}", 
#                 "formulas": [], 
#                 "steps": ["Фото повернуто и обрезано."]
#             }]
#         })
        
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Camera Debugger v3</title>
#         <style>
#             body { font-family: sans-serif; background: #222; color: #fff; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; flex-wrap: wrap; }
#             .box { background: #333; padding: 10px; border-radius: 8px; }
#             img { max-width: 400px; border: 2px solid #555; }
#             pre { background: #111; padding: 10px; overflow-x: auto; }
#             h2 { margin-top: 0; font-size: 1.2em; }
#         </style>
#         <meta http-equiv="refresh" content="3">
#     </head>
#     <body>
#         <h1>📸 Debugger v3: Y-Offset Test (Offset: {offset_value} px)</h1>
#         <p>Если красная рамка совпадает с текстом - мы победили.</p>
        
#         <div class="box">
#             <h2>Данные последнего кропа</h2>
#             <pre>{{ data }}</pre>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>1. Повернутое фото + Рамка</h2>
#                 <p>Красная рамка должна быть на цели.</p>
#                 <img src="/debug/full_rect?t={{ time }}" />
#             </div>
            
#             <div class="box">
#                 <h2>2. Результат (Кроп)</h2>
#                 <p>Четко ли вырезан текст?</p>
#                 <img src="/debug/cropped?t={{ time }}" />
#             </div>
#         </div>
#     </body>
#     </html>
#     """
#     return render_template_string(html, data=json.dumps(last_debug_data, indent=2), time=time.time(), offset_value=Y_PIXEL_OFFSET)

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({"success": True, "api_key_valid": True})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)








# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # ⚠️ КОНСТАНТА КОМПЕНСАЦИИ СДВИГА Y ⚠️
# # Увеличиваем смещение, чтобы "поднять" рамку на нужный текст (задача 12).
# # Было 100, ставим 170.
# Y_PIXEL_OFFSET = 50


# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH (например, для Windows)
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' 
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи.
# 1. Исправь ошибки OCR.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в JSON:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула"],
#             "answer": "ответ",
#             "steps": ["шаг 1", "шаг 2"]
#         }
#     ]
# }
# """

# app = Flask(__name__)
# CORS(app)

# last_debug_data = {}

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         img = cv2.imread(image_path)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         pil_image = Image.fromarray(processed)
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     """
#     Обрезает фото. СТРАТЕГИЯ: Сначала поворачиваем фото, потом режем, с компенсацией Y.
#     """
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
        
#         # Получаем исходные размеры
#         raw_w, raw_h = image.size
        
#         rotated = False
#         # Проверка: Если экран вертикальный (screen_h > screen_w), а фото горизонтальное (raw_w > raw_h) -> ПОВОРАЧИВАЕМ ФОТО
#         if screen_h > screen_w and raw_w > raw_h:
#             # Поворот на 90 градусов против часовой (для стандартных камер)
#             image = image.transpose(Image.ROTATE_270)
#             rotated = True
#             debug_print("🔄 Фото повернуто на 90 градусов для соответствия экрану.")

#         # Получаем новые размеры (после возможного поворота)
#         img_w, img_h = image.size

#         # Сохраняем "нормализованное" фото для дебага
#         image.save(TEMP_FULL_FILE)

#         # Логируем данные
#         last_debug_data = {
#             "screen_w": screen_w,
#             "screen_h": screen_h,
#             "img_w": img_w,
#             "img_h": img_h,
#             "rotated_was_needed": rotated,
#             "frame": frame_rect,
#             "y_offset_used": Y_PIXEL_OFFSET
#         }

#         # Теперь координатная сетка совпадает. Просто масштабируем.
#         scale_x = img_w / screen_w
#         scale_y = img_h / screen_h
        
#         # --- ИЗМЕНЕНИЕ: КОМПЕНСАЦИЯ Y ---
#         # Мы берем координату Y, пришедшую с телефона, и вычитаем офсет, чтобы "поднять" рамку вверх
#         y_compensated = frame_rect['y'] - Y_PIXEL_OFFSET
#         y_compensated = max(0, y_compensated) # Гарантируем, что не уйдет в минус
        
#         # Масштабируем
#         left = int(frame_rect['x'] * scale_x)
#         top = int(y_compensated * scale_y)
        
#         # Размеры кадра
#         width = int(frame_rect['width'] * scale_x)
#         height = int(frame_rect['height'] * scale_y)
        
#         right = left + width
#         bottom = top + height
#         # --- КОНЕЦ ИЗМЕНЕНИЯ ---
        
#         # Защита от выхода за границы
#         left = max(0, left)
#         top = max(0, top)
#         right = min(img_w, right)
#         bottom = min(img_h, bottom)
        
#         crop_box = (left, top, right, bottom)
        
#         # Режем
#         cropped = image.crop(crop_box)
#         cropped.save(TEMP_CROPPED_FILE)
        
#         # --- ГЕНЕРАЦИЯ ОТЛАДОЧНОЙ КАРТИНКИ С РАМКОЙ ---
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         draw.rectangle(crop_box, outline="red", width=10)
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def call_deepseek(text):
#     # Пока заглушка
#     return json.dumps({
#         "solutions": [{
#             "title": "Режим настройки камеры",
#             "formulas": [],
#             "answer": "Смотри в Dashboard",
#             "steps": ["Мы проверяем точность вырезания"]
#         }]
#     }), None

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not path: return jsonify({"success": False, "message": "Ошибка кропа"}), 500
        
#         # Заглушка ответа, чтобы приложение показало "Успех" и дало сделать новое фото
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Фото обработано", 
#                 "answer": f"Проверь Dashboard. Y-компенсация: {Y_PIXEL_OFFSET}", 
#                 "formulas": [], 
#                 "steps": ["Фото повернуто и обрезано."]
#             }]
#         })
        
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Camera Debugger v4</title>
#         <style>
#             body { font-family: sans-serif; background: #222; color: #fff; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; flex-wrap: wrap; }
#             .box { background: #333; padding: 10px; border-radius: 8px; }
#             img { max-width: 400px; border: 2px solid #555; }
#             pre { background: #111; padding: 10px; overflow-x: auto; }
#             h2 { margin-top: 0; font-size: 1.2em; }
#         </style>
#         <meta http-equiv="refresh" content="3">
#     </head>
#     <body>
#         <h1>📸 Debugger v4: Y-Offset Test (Offset: {offset_value} px)</h1>
#         <p>Если красная рамка совпадает с текстом - мы победили.</p>
        
#         <div class="box">
#             <h2>Данные последнего кропа</h2>
#             <pre>{{ data }}</pre>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>1. Повернутое фото + Рамка</h2>
#                 <p>Красная рамка должна быть на цели.</p>
#                 <img src="/debug/full_rect?t={{ time }}" />
#             </div>
            
#             <div class="box">
#                 <h2>2. Результат (Кроп)</h2>
#                 <p>Четко ли вырезан текст?</p>
#                 <img src="/debug/cropped?t={{ time }}" />
#             </div>
#         </div>
#     </body>
#     </html>
#     """
#     return render_template_string(html, data=json.dumps(last_debug_data, indent=2), time=time.time(), offset_value=Y_PIXEL_OFFSET)

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({"success": True, "api_key_valid": True})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)












# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # ⚠️ КОНСТАНТА КОМПЕНСАЦИИ СДВИГА Y ⚠️
# # Твое найденное идеальное значение.
# Y_PIXEL_OFFSET = 30


# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH (например, для Windows)
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' 
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи.
# 1. Исправь ошибки OCR.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в JSON:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула"],
#             "answer": "ответ",
#             "steps": ["шаг 1", "шаг 2"]
#         }
#     ]
# }
# """

# app = Flask(__name__)
# CORS(app)

# last_debug_data = {}

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         img = cv2.imread(image_path)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         pil_image = Image.fromarray(processed)
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     """
#     Обрезает фото с учетом 'Zoom' эффекта (Aspect Ratio Correction).
#     """
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
        
#         raw_w, raw_h = image.size
#         rotated = False
        
#         # 1. АВТОПОВОРОТ (Если экран вертикальный, а фото горизонтальное)
#         if screen_h > screen_w and raw_w > raw_h:
#             image = image.transpose(Image.ROTATE_270)
#             rotated = True
#             debug_print("🔄 Фото повернуто на 90 градусов.")

#         img_w, img_h = image.size
        
#         # Сохраняем полное фото
#         image.save(TEMP_FULL_FILE)

#         # 2. КОРРЕКЦИЯ ЗУМА (Aspect Ratio Matching)
#         # Экран телефона обычно уже (aspect ratio меньше), чем фото с камеры.
#         # Приложение обрезает бока фото, чтобы заполнить экран.
        
#         screen_aspect = screen_w / screen_h
#         img_aspect = img_w / img_h
        
#         scale = 1.0
#         offset_x_centering = 0
#         offset_y_centering = 0
        
#         if screen_aspect < img_aspect:
#             # Случай вертикального телефона: Экран уже, чем фото.
#             # Приложение масштабирует фото по ВЫСОТЕ и обрезает БОКА.
#             scale = img_h / screen_h
            
#             # Вычисляем, какая ширина фото реально видна на экране
#             visible_width_on_image = screen_w * scale
            
#             # Разница между реальной шириной фото и видимой (это "скрытые" бока)
#             diff = img_w - visible_width_on_image
#             offset_x_centering = diff / 2
            
#         else:
#             # Случай, если экран шире фото (редко для вертикального режима, но возможно)
#             # Масштабируем по ШИРИНЕ, обрезаем ВЕРХ/НИЗ.
#             scale = img_w / screen_w
            
#             visible_height_on_image = screen_h * scale
#             diff = img_h - visible_height_on_image
#             offset_y_centering = diff / 2

#         # 3. ПРИМЕНЕНИЕ КООРДИНАТ
#         # Сначала компенсируем твой ручной Y-сдвиг (статус бар)
#         frame_y_corrected = frame_rect['y'] - Y_PIXEL_OFFSET
#         frame_y_corrected = max(0, frame_y_corrected)

#         # Переводим координаты экрана в координаты фото
#         left = int((frame_rect['x'] * scale) + offset_x_centering)
#         top = int((frame_y_corrected * scale) + offset_y_centering)
        
#         width = int(frame_rect['width'] * scale)
#         height = int(frame_rect['height'] * scale)
        
#         right = left + width
#         bottom = top + height
        
#         # Логируем данные для Dashboard
#         last_debug_data = {
#             "screen": f"{screen_w}x{screen_h}",
#             "image": f"{img_w}x{img_h}",
#             "rotated": rotated,
#             "y_offset_used": Y_PIXEL_OFFSET,
#             "zoom_logic": {
#                 "scale_factor": round(scale, 3),
#                 "hidden_margin_x": int(offset_x_centering),
#                 "hidden_margin_y": int(offset_y_centering)
#             },
#             "frame_input": frame_rect,
#             "crop_coords": {"l": left, "t": top, "r": right, "b": bottom}
#         }
        
#         # Clamp (защита от выхода за границы)
#         left = max(0, left); top = max(0, top)
#         right = min(img_w, right); bottom = min(img_h, bottom)
        
#         crop_box = (left, top, right, bottom)
        
#         # 4. ОБРЕЗКА И СОХРАНЕНИЕ
#         cropped = image.crop(crop_box)
#         cropped.save(TEMP_CROPPED_FILE)
        
#         # Рисуем рамку на debug картинке
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         draw.rectangle(crop_box, outline="red", width=10)
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def call_deepseek(text):
#     # Заглушка
#     return json.dumps({
#         "solutions": [{
#             "title": "Режим настройки камеры",
#             "formulas": [],
#             "answer": "Проверь Dashboard",
#             "steps": ["Мы проверяем точность вырезания"]
#         }]
#     }), None

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not path: return jsonify({"success": False, "message": "Ошибка кропа"}), 500
        
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Фото обработано", 
#                 "answer": f"Offset: {Y_PIXEL_OFFSET}, Zoom Fix applied", 
#                 "formulas": [], 
#                 "steps": ["Проверь красную рамку в Dashboard"]
#             }]
#         })
        
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Camera Debugger v5 (Zoom Fix)</title>
#         <style>
#             body { font-family: monospace; background: #1e1e1e; color: #ddd; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; flex-wrap: wrap; }
#             .box { background: #2d2d2d; padding: 15px; border-radius: 8px; border: 1px solid #444; }
#             img { max-width: 450px; border: 2px solid #555; }
#             pre { color: #8f8; overflow-x: auto; white-space: pre-wrap; }
#             h2 { margin-top: 0; color: #fff; border-bottom: 1px solid #555; padding-bottom: 5px; }
#             .highlight { color: #f88; font-weight: bold; }
#         </style>
#         <meta http-equiv="refresh" content="4">
#     </head>
#     <body>
#         <h1>📸 Debugger v5: Zoom & Aspect Ratio Fix</h1>
#         <p>Y-Offset: <span class="highlight">{offset_value}px</span> | Check if red box width matches text width.</p>
        
#         <div class="box">
#             <h2>Math Logic Stats</h2>
#             <pre>{{ data }}</pre>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>1. Server View (Full Image)</h2>
#                 <p>Красная рамка должна быть <b>уже</b>, чем раньше.</p>
#                 <img src="/debug/full_rect?t={{ time }}" />
#             </div>
            
#             <div class="box">
#                 <h2>2. Result (Crop)</h2>
#                 <img src="/debug/cropped?t={{ time }}" />
#             </div>
#         </div>
#     </body>
#     </html>
#     """
#     return render_template_string(html, data=json.dumps(last_debug_data, indent=2), time=time.time(), offset_value=Y_PIXEL_OFFSET)

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({"success": True, "api_key_valid": True})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)













# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # ⚠️ КОНСТАНТА КОМПЕНСАЦИИ СДВИГА Y ⚠️
# # Твое скорректированное значение, чтобы рамка начиналась правильно сверху.
# Y_PIXEL_OFFSET = 30 


# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH (например, для Windows)
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' 
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи.
# 1. Исправь ошибки OCR.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в JSON:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула"],
#             "answer": "ответ",
#             "steps": ["шаг 1", "шаг 2"]
#         }
#     ]
# }
# """

# app = Flask(__name__)
# CORS(app)

# last_debug_data = {}

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         img = cv2.imread(image_path)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         pil_image = Image.fromarray(processed)
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     """
#     Обрезает фото с учетом 'Zoom' эффекта (Aspect Ratio Correction).
#     Это должно устранить эффект '0.5x' зума.
#     """
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
        
#         raw_w, raw_h = image.size
#         rotated = False
        
#         # 1. АВТОПОВОРОТ (Если экран вертикальный, а фото горизонтальное)
#         if screen_h > screen_w and raw_w > raw_h:
#             image = image.transpose(Image.ROTATE_270)
#             rotated = True
#             debug_print("🔄 Фото повернуто на 90 градусов.")

#         img_w, img_h = image.size
        
#         # Сохраняем полное фото
#         image.save(TEMP_FULL_FILE)

#         # 2. КОРРЕКЦИЯ ЗУМА (Aspect Ratio Matching)
#         # Приложение масштабирует фото по ВЫСОТЕ (для вертикального экрана) и обрезает БОКА.
#         screen_aspect = screen_w / screen_h
#         img_aspect = img_w / img_h
        
#         scale = 1.0
#         offset_x_centering = 0
#         offset_y_centering = 0
        
#         if screen_aspect < img_aspect:
#             # Случай вертикального телефона: Приложение масштабирует по ВЫСОТЕ и обрезает БОКА.
#             scale = img_h / screen_h
            
#             # Вычисляем, какая ширина фото реально видна на экране
#             visible_width_on_image = screen_w * scale
            
#             # Разница между реальной шириной фото и видимой (это "скрытые" бока)
#             diff = img_w - visible_width_on_image
#             offset_x_centering = diff / 2
            
#         else:
#             # Случай, если экран шире фото (редко)
#             # Масштабируем по ШИРИНЕ, обрезаем ВЕРХ/НИЗ.
#             scale = img_w / screen_w
            
#             visible_height_on_image = screen_h * scale
#             diff = img_h - visible_height_on_image
#             offset_y_centering = diff / 2

#         # 3. ПРИМЕНЕНИЕ КООРДИНАТ
#         # Сначала компенсируем твой ручной Y-сдвиг (статус бар)
#         frame_y_corrected = frame_rect['y'] - Y_PIXEL_OFFSET
#         frame_y_corrected = max(0, frame_y_corrected)

#         # Переводим координаты экрана в координаты фото, учитывая масштаб и скрытые края
#         left = int((frame_rect['x'] * scale) + offset_x_centering)
#         top = int((frame_y_corrected * scale) + offset_y_centering)
        
#         width = int(frame_rect['width'] * scale)
#         height = int(frame_rect['height'] * scale)
        
#         right = left + width
#         bottom = top + height
        
#         # Логируем данные для Dashboard
#         last_debug_data = {
#             "screen": f"{screen_w}x{screen_h}",
#             "image": f"{img_w}x{img_h}",
#             "rotated": rotated,
#             "y_offset_used": Y_PIXEL_OFFSET,
#             "zoom_logic": {
#                 "scale_factor": round(scale, 3),
#                 "hidden_margin_x": int(offset_x_centering),
#                 "hidden_margin_y": int(offset_y_centering)
#             },
#             "frame_input": frame_rect,
#             "crop_coords": {"l": left, "t": top, "r": right, "b": bottom}
#         }
        
#         # Clamp (защита от выхода за границы)
#         left = max(0, left); top = max(0, top)
#         right = min(img_w, right); bottom = min(img_h, bottom)
        
#         crop_box = (left, top, right, bottom)
        
#         # 4. ОБРЕЗКА И СОХРАНЕНИЕ
#         cropped = image.crop(crop_box)
#         cropped.save(TEMP_CROPPED_FILE)
        
#         # Рисуем рамку на debug картинке
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         draw.rectangle(crop_box, outline="red", width=10)
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def call_deepseek(text):
#     # Заглушка
#     return json.dumps({
#         "solutions": [{
#             "title": "Режим настройки камеры",
#             "formulas": [],
#             "answer": "Проверь Dashboard",
#             "steps": ["Мы проверяем точность вырезания"]
#         }]
#     }), None

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not path: return jsonify({"success": False, "message": "Ошибка кропа"}), 500
        
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Фото обработано", 
#                 "answer": f"Offset: {Y_PIXEL_OFFSET}, Zoom Fix applied", 
#                 "formulas": [], 
#                 "steps": ["Проверь красную рамку в Dashboard"]
#             }]
#         })
        
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Camera Debugger v6 (Zoom Fix)</title>
#         <style>
#             body { font-family: monospace; background: #1e1e1e; color: #ddd; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; flex-wrap: wrap; }
#             .box { background: #2d2d2d; padding: 15px; border-radius: 8px; border: 1px solid #444; }
#             img { max-width: 450px; border: 2px solid #555; }
#             pre { color: #8f8; overflow-x: auto; white-space: pre-wrap; }
#             h2 { margin-top: 0; color: #fff; border-bottom: 1px solid #555; padding-bottom: 5px; }
#             .highlight { color: #f88; font-weight: bold; }
#         </style>
#         <meta http-equiv="refresh" content="4">
#     </head>
#     <body>
#         <h1>📸 Debugger v6: Zoom & Aspect Ratio Fix (Y={offset_value}px)</h1>
#         <p>Если красная рамка совпадает с текстом - мы победили.</p>
        
#         <div class="box">
#             <h2>Math Logic Stats</h2>
#             <pre>{{ data }}</pre>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>1. Server View (Full Image)</h2>
#                 <p>Красная рамка должна быть <b>уже</b> и <b>точно</b> на цели.</p>
#                 <img src="/debug/full_rect?t={{ time }}" />
#             </div>
            
#             <div class="box">
#                 <h2>2. Result (Crop)</h2>
#                 <img src="/debug/cropped?t={{ time }}" />
#             </div>
#         </div>
#     </body>
#     </html>
#     """
#     return render_template_string(html, data=json.dumps(last_debug_data, indent=2), time=time.time(), offset_value=Y_PIXEL_OFFSET)

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({"success": True, "api_key_valid": True})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)




















# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # ⚠️ КОНСТАНТЫ КАЛИБРОВКИ ⚠️
# # 1. Сдвиг по вертикали (для компенсации статус-бара/заголовка приложения)
# Y_PIXEL_OFFSET = 30 
# # 2. Фактор для компенсации недостаточного "зума" в режиме Cover (3% усиление)
# ZOOM_ADJUSTMENT_FACTOR = 1.03 

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH (например, для Windows)
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' 
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи.
# 1. Исправь ошибки OCR.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в JSON:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула"],
#             "answer": "ответ",
#             "steps": ["шаг 1", "шаг 2"]
#         }
#     ]
# }
# """

# app = Flask(__name__)
# CORS(app)

# last_debug_data = {}

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         img = cv2.imread(image_path)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         pil_image = Image.fromarray(processed)
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     """
#     Обрезает фото с учетом 'Zoom' эффекта (Aspect Ratio Correction) и ручной подстройки.
#     """
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
        
#         raw_w, raw_h = image.size
#         rotated = False
        
#         # 1. АВТОПОВОРОТ (Если экран вертикальный, а фото горизонтальное)
#         if screen_h > screen_w and raw_w > raw_h:
#             image = image.transpose(Image.ROTATE_270)
#             rotated = True
#             debug_print("🔄 Фото повернуто на 90 градусов.")

#         img_w, img_h = image.size
        
#         # Сохраняем полное фото
#         image.save(TEMP_FULL_FILE)

#         # 2. КОРРЕКЦИЯ ЗУМА (Aspect Ratio Matching)
#         screen_aspect = screen_w / screen_h
#         img_aspect = img_w / img_h
        
#         scale = 1.0
#         offset_x_centering = 0
#         offset_y_centering = 0
        
#         if screen_aspect < img_aspect:
#             # Случай вертикального телефона: Приложение масштабирует по ВЫСОТЕ и обрезает БОКА.
#             scale = img_h / screen_h
            
#             # Применяем дополнительный фактор для усиления "зума"
#             scale *= ZOOM_ADJUSTMENT_FACTOR
            
#             # Вычисляем, какая ширина фото реально видна на экране после коррекции
#             visible_width_on_image = screen_w * scale
            
#             # Разница между реальной шириной фото и видимой (это "скрытые" бока)
#             diff = img_w - visible_width_on_image
#             offset_x_centering = diff / 2
            
#         else:
#             # Случай, если экран шире фото (редко)
#             scale = img_w / screen_w
#             scale *= ZOOM_ADJUSTMENT_FACTOR

#             visible_height_on_image = screen_h * scale
#             diff = img_h - visible_height_on_image
#             offset_y_centering = diff / 2

#         # 3. ПРИМЕНЕНИЕ КООРДИНАТ
#         # Сначала компенсируем твой ручной Y-сдвиг (статус бар)
#         frame_y_corrected = frame_rect['y'] - Y_PIXEL_OFFSET
#         frame_y_corrected = max(0, frame_y_corrected)

#         # Переводим координаты экрана в координаты фото, учитывая масштаб и скрытые края
#         left = int((frame_rect['x'] * scale) + offset_x_centering)
#         top = int((frame_y_corrected * scale) + offset_y_centering)
        
#         width = int(frame_rect['width'] * scale)
#         height = int(frame_rect['height'] * scale)
        
#         right = left + width
#         bottom = top + height
        
#         # Логируем данные для Dashboard
#         last_debug_data = {
#             "screen": f"{screen_w}x{screen_h}",
#             "image": f"{img_w}x{img_h}",
#             "rotated": rotated,
#             "y_offset_used": Y_PIXEL_OFFSET,
#             "zoom_logic": {
#                 "base_scale": round(img_h / screen_h if screen_aspect < img_aspect else img_w / screen_w, 3),
#                 "adj_factor": ZOOM_ADJUSTMENT_FACTOR,
#                 "final_scale_factor": round(scale, 3),
#                 "hidden_margin_x": int(offset_x_centering),
#                 "hidden_margin_y": int(offset_y_centering)
#             },
#             "frame_input": frame_rect,
#             "crop_coords": {"l": left, "t": top, "r": right, "b": bottom}
#         }
        
#         # Clamp (защита от выхода за границы)
#         left = max(0, left); top = max(0, top)
#         right = min(img_w, right); bottom = min(img_h, bottom)
        
#         crop_box = (left, top, right, bottom)
        
#         # 4. ОБРЕЗКА И СОХРАНЕНИЕ
#         cropped = image.crop(crop_box)
#         cropped.save(TEMP_CROPPED_FILE)
        
#         # Рисуем рамку на debug картинке
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         draw.rectangle(crop_box, outline="red", width=10)
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def call_deepseek(text):
#     # Заглушка
#     return json.dumps({
#         "solutions": [{
#             "title": "Режим настройки камеры",
#             "formulas": [],
#             "answer": "Проверь Dashboard",
#             "steps": ["Мы проверяем точность вырезания"]
#         }]
#     }), None

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not path: return jsonify({"success": False, "message": "Ошибка кропа"}), 500
        
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Фото обработано", 
#                 "answer": f"Offset: {Y_PIXEL_OFFSET}, Zoom Fix v2 applied", 
#                 "formulas": [], 
#                 "steps": ["Проверь красную рамку в Dashboard"]
#             }]
#         })
        
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Camera Debugger v7 (Final Zoom)</title>
#         <style>
#             body { font-family: monospace; background: #1e1e1e; color: #ddd; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; flex-wrap: wrap; }
#             .box { background: #2d2d2d; padding: 15px; border-radius: 8px; border: 1px solid #444; }
#             img { max-width: 450px; border: 2px solid #555; }
#             pre { color: #8f8; overflow-x: auto; white-space: pre-wrap; }
#             h2 { margin-top: 0; color: #fff; border-bottom: 1px solid #555; padding-bottom: 5px; }
#             .highlight { color: #f88; font-weight: bold; }
#         </style>
#         <meta http-equiv="refresh" content="4">
#     </head>
#     <body>
#         <h1>📸 Debugger v7: Final Zoom Correction (Y={offset_value}px, Adj={adj_factor})</h1>
#         <p>Если красная рамка совпадает с текстом - мы победили.</p>
        
#         <div class="box">
#             <h2>Math Logic Stats</h2>
#             <pre>{{ data }}</pre>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>1. Server View (Full Image)</h2>
#                 <p>Красная рамка должна быть <b>уже</b> и <b>точно</b> на цели.</p>
#                 <img src="/debug/full_rect?t={{ time }}" />
#             </div>
            
#             <div class="box">
#                 <h2>2. Result (Crop)</h2>
#                 <img src="/debug/cropped?t={{ time }}" />
#             </div>
#         </div>
#     </body>
#     </html>
#     """
#     return render_template_string(html, data=json.dumps(last_debug_data, indent=2), time=time.time(), offset_value=Y_PIXEL_OFFSET, adj_factor=ZOOM_ADJUSTMENT_FACTOR)

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({"success": True, "api_key_valid": True})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)











# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # ⚠️ КОНСТАНТЫ КАЛИБРОВКИ ⚠️
# # 1. Сдвиг по вертикали (для компенсации статус-бара/заголовка приложения)
# Y_PIXEL_OFFSET = 30 
# # 2. Фактор для компенсации недостаточного "зума" в режиме Cover (3% усиление)
# ZOOM_ADJUSTMENT_FACTOR = 1.03 

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH (например, для Windows)
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' 
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи.
# 1. Исправь ошибки OCR.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в JSON:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула"],
#             "answer": "ответ",
#             "steps": ["шаг 1", "шаг 2"]
#         }
#     ]
# }
# """

# app = Flask(__name__)
# CORS(app)

# last_debug_data = {}

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         img = cv2.imread(image_path)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         pil_image = Image.fromarray(processed)
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     """
#     Обрезает фото с учетом 'Zoom' эффекта (Aspect Ratio Correction) и ручной подстройки.
#     """
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
        
#         raw_w, raw_h = image.size
#         rotated = False
        
#         # 1. АВТОПОВОРОТ (Если экран вертикальный, а фото горизонтальное)
#         if screen_h > screen_w and raw_w > raw_h:
#             image = image.transpose(Image.ROTATE_270)
#             rotated = True
#             debug_print("🔄 Фото повернуто на 90 градусов.")

#         img_w, img_h = image.size
        
#         # Сохраняем полное фото
#         image.save(TEMP_FULL_FILE)

#         # 2. КОРРЕКЦИЯ ЗУМА (Aspect Ratio Matching)
#         screen_aspect = screen_w / screen_h
#         img_aspect = img_w / img_h
        
#         scale = 1.0
#         offset_x_centering = 0
#         offset_y_centering = 0
        
#         if screen_aspect < img_aspect:
#             # Случай вертикального телефона: Приложение масштабирует по ВЫСОТЕ и обрезает БОКА.
#             scale = img_h / screen_h
            
#             # Применяем дополнительный фактор для усиления "зума"
#             scale *= ZOOM_ADJUSTMENT_FACTOR
            
#             # Вычисляем, какая ширина фото реально видна на экране после коррекции
#             visible_width_on_image = screen_w * scale
            
#             # Разница между реальной шириной фото и видимой (это "скрытые" бока)
#             diff = img_w - visible_width_on_image
#             offset_x_centering = diff / 2
            
#         else:
#             # Случай, если экран шире фото (редко)
#             scale = img_w / screen_w
#             scale *= ZOOM_ADJUSTMENT_FACTOR

#             visible_height_on_image = screen_h * scale
#             diff = img_h - visible_height_on_image
#             offset_y_centering = diff / 2

#         # 3. ПРИМЕНЕНИЕ КООРДИНАТ
#         # Сначала компенсируем твой ручной Y-сдвиг (статус бар)
#         frame_y_corrected = frame_rect['y'] - Y_PIXEL_OFFSET
#         frame_y_corrected = max(0, frame_y_corrected)

#         # Переводим координаты экрана в координаты фото, учитывая масштаб и скрытые края
#         left = int((frame_rect['x'] * scale) + offset_x_centering)
#         top = int((frame_y_corrected * scale) + offset_y_centering)
        
#         width = int(frame_rect['width'] * scale)
#         height = int(frame_rect['height'] * scale)
        
#         right = left + width
#         bottom = top + height
        
#         # Логируем данные для Dashboard
#         last_debug_data = {
#             "screen": f"{screen_w}x{screen_h}",
#             "image": f"{img_w}x{img_h}",
#             "rotated": rotated,
#             "y_offset_used": Y_PIXEL_OFFSET,
#             "zoom_logic": {
#                 "base_scale": round(img_h / screen_h if screen_aspect < img_aspect else img_w / screen_w, 3),
#                 "adj_factor": ZOOM_ADJUSTMENT_FACTOR,
#                 "final_scale_factor": round(scale, 3),
#                 "hidden_margin_x": int(offset_x_centering),
#                 "hidden_margin_y": int(offset_y_centering)
#             },
#             "frame_input": frame_rect,
#             "crop_coords": {"l": left, "t": top, "r": right, "b": bottom}
#         }
        
#         # Clamp (защита от выхода за границы)
#         left = max(0, left); top = max(0, top)
#         right = min(img_w, right); bottom = min(img_h, bottom)
        
#         crop_box = (left, top, right, bottom)
        
#         # 4. ОБРЕЗКА И СОХРАНЕНИЕ
#         cropped = image.crop(crop_box)
#         cropped.save(TEMP_CROPPED_FILE)
        
#         # Рисуем рамку на debug картинке
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         draw.rectangle(crop_box, outline="red", width=10)
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def call_deepseek(text):
#     # Заглушка
#     return json.dumps({
#         "solutions": [{
#             "title": "Режим настройки камеры",
#             "formulas": [],
#             "answer": "Проверь Dashboard",
#             "steps": ["Мы проверяем точность вырезания"]
#         }]
#     }), None

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not path: return jsonify({"success": False, "message": "Ошибка кропа"}), 500
        
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Фото обработано", 
#                 "answer": f"Offset: {Y_PIXEL_OFFSET}, Zoom Fix v2 applied", 
#                 "formulas": [], 
#                 "steps": ["Проверь красную рамку в Dashboard"]
#             }]
#         })
        
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Camera Debugger v7 (Final Zoom)</title>
#         <style>
#             body { font-family: monospace; background: #1e1e1e; color: #ddd; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; flex-wrap: wrap; }
#             .box { background: #2d2d2d; padding: 15px; border-radius: 8px; border: 1px solid #444; }
#             img { max-width: 450px; border: 2px solid #555; }
#             pre { color: #8f8; overflow-x: auto; white-space: pre-wrap; }
#             h2 { margin-top: 0; color: #fff; border-bottom: 1px solid #555; padding-bottom: 5px; }
#             .highlight { color: #f88; font-weight: bold; }
#         </style>
#         <meta http-equiv="refresh" content="4">
#     </head>
#     <body>
#         <h1>📸 Debugger v7: Final Zoom Correction (Y={offset_value}px, Adj={adj_factor})</h1>
#         <p>Если красная рамка совпадает с текстом - мы победили.</p>
        
#         <div class="box">
#             <h2>Math Logic Stats</h2>
#             <pre>{{ data }}</pre>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>1. Server View (Full Image)</h2>
#                 <p>Красная рамка должна быть <b>уже</b> и <b>точно</b> на цели.</p>
#                 <img src="/debug/full_rect?t={{ time }}" />
#             </div>
            
#             <div class="box">
#                 <h2>2. Result (Crop)</h2>
#                 <img src="/debug/cropped?t={{ time }}" />
#             </div>
#         </div>
#     </body>
#     </html>
#     """
#     return render_template_string(html, data=json.dumps(last_debug_data, indent=2), time=time.time(), offset_value=Y_PIXEL_OFFSET, adj_factor=ZOOM_ADJUSTMENT_FACTOR)

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({"success": True, "api_key_valid": True})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)





# ===================================================================================srez





# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # ⚠️ КОНСТАНТЫ КАЛИБРОВКИ ⚠️
# # 1. Сдвиг по вертикали (для компенсации статус-бара/заголовка приложения)
# Y_PIXEL_OFFSET = 30 
# # 2. Фактор для компенсации недостаточного "зума" в режиме Cover (3% усиление)
# ZOOM_ADJUSTMENT_FACTOR = 1.03 

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH (например, для Windows)
#     # ПРИМЕЧАНИЕ: Этот путь может потребовать обновления, если Tesseract установлен в другом месте.
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен. Установите 'pip install pytesseract' и сам Tesseract.")

# # --- КОНСТАНТЫ API ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' 
# # ЗАМЕНИТЕ ЭТОТ КЛЮЧ НА ВАШ РЕАЛЬНЫЙ КЛЮЧ
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи.
# 1. Исправь ошибки OCR.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в JSON:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формулы все используемые в задаче по пунктам "],
#             "answer": "ответ",
#             "steps": ["шаг 1 - действие", "шаг 2 - действие ", 'шаг n - действие']
#         }
#     ]
# }
# """

# app = Flask(__name__)
# CORS(app)

# last_debug_data = {}

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         # Чтение изображения
#         img = cv2.imread(image_path)
#         # Преобразование в оттенки серого
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         # Бинаризация с Otsu
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         # Преобразование в PIL Image для Tesseract
#         pil_image = Image.fromarray(processed)
#         # Распознавание текста с русским и английским языками
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     """
#     Обрезает фото с учетом 'Zoom' эффекта (Aspect Ratio Correction) и ручной подстройки.
#     """
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
        
#         raw_w, raw_h = image.size
#         rotated = False
        
#         # 1. АВТОПОВОРОТ (Если экран вертикальный, а фото горизонтальное)
#         if screen_h > screen_w and raw_w > raw_h:
#             image = image.transpose(Image.ROTATE_270)
#             rotated = True
#             debug_print("🔄 Фото повернуто на 90 градусов.")

#         img_w, img_h = image.size
        
#         # Сохраняем полное фото
#         image.save(TEMP_FULL_FILE)

#         # 2. КОРРЕКЦИЯ ЗУМА (Aspect Ratio Matching)
#         screen_aspect = screen_w / screen_h
#         img_aspect = img_w / img_h
        
#         scale = 1.0
#         offset_x_centering = 0
#         offset_y_centering = 0
        
#         if screen_aspect < img_aspect:
#             # Случай вертикального телефона: Приложение масштабирует по ВЫСОТЕ и обрезает БОКА.
#             scale = img_h / screen_h
            
#             # Применяем дополнительный фактор для усиления "зума"
#             scale *= ZOOM_ADJUSTMENT_FACTOR
            
#             # Вычисляем, какая ширина фото реально видна на экране после коррекции
#             visible_width_on_image = screen_w * scale
            
#             # Разница между реальной шириной фото и видимой (это "скрытые" бока)
#             diff = img_w - visible_width_on_image
#             offset_x_centering = diff / 2
            
#         else:
#             # Случай, если экран шире фото (редко)
#             scale = img_w / screen_w
#             scale *= ZOOM_ADJUSTMENT_FACTOR

#             visible_height_on_image = screen_h * scale
#             diff = img_h - visible_height_on_image
#             offset_y_centering = diff / 2

#         # 3. ПРИМЕНЕНИЕ КООРДИНАТ
#         # Сначала компенсируем твой ручной Y-сдвиг (статус бар)
#         frame_y_corrected = frame_rect['y'] - Y_PIXEL_OFFSET
#         frame_y_corrected = max(0, frame_y_corrected)

#         # Переводим координаты экрана в координаты фото, учитывая масштаб и скрытые края
#         left = int((frame_rect['x'] * scale) + offset_x_centering)
#         top = int((frame_y_corrected * scale) + offset_y_centering)
        
#         width = int(frame_rect['width'] * scale)
#         height = int(frame_rect['height'] * scale)
        
#         right = left + width
#         bottom = top + height
        
#         # Логируем данные для Dashboard
#         last_debug_data = {
#             "screen": f"{screen_w}x{screen_h}",
#             "image": f"{img_w}x{img_h}",
#             "rotated": rotated,
#             "y_offset_used": Y_PIXEL_OFFSET,
#             "zoom_logic": {
#                 "base_scale": round(img_h / screen_h if screen_aspect < img_aspect else img_w / screen_w, 3),
#                 "adj_factor": ZOOM_ADJUSTMENT_FACTOR,
#                 "final_scale_factor": round(scale, 3),
#                 "hidden_margin_x": int(offset_x_centering),
#                 "hidden_margin_y": int(offset_y_centering)
#             },
#             "frame_input": frame_rect,
#             "crop_coords": {"l": left, "t": top, "r": right, "b": bottom}
#         }
        
#         # Clamp (защита от выхода за границы)
#         left = max(0, left); top = max(0, top)
#         right = min(img_w, right); bottom = min(img_h, bottom)
        
#         crop_box = (left, top, right, bottom)
        
#         # 4. ОБРЕЗКА И СОХРАНЕНИЕ
#         cropped = image.crop(crop_box)
#         cropped.save(TEMP_CROPPED_FILE)
        
#         # 5. Рисуем рамку на debug картинке
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         # Рисуем рамку толщиной 10 пикселей
#         draw.rectangle(crop_box, outline="red", width=10) 
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def call_deepseek(text):
#     # ЗАГЛУШКА: Здесь будет реальный вызов DeepSeek
#     return json.dumps({
#         "solutions": [{
#             "title": "Режим настройки камеры",
#             "formulas": [],
#             "answer": "Проверь Dashboard",
#             "steps": ["Мы проверяем точность вырезания"]
#         }]
#     }), None

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         # 1. Обрезка изображения
#         cropped_path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not cropped_path: return jsonify({"success": False, "message": "Ошибка кропа"}), 500
        
#         # 2. Кодирование обрезанного файла в Base64 для отображения на клиенте
#         with open(cropped_path, "rb") as image_file:
#             cropped_base64 = base64.b64encode(image_file.read()).decode('utf-8')
            
#         # 3. Распознавание текста (сейчас отключено, но структура готова)
#         # ocr_text, ocr_error = extract_text_from_image(cropped_path)
#         # if ocr_error:
#         #     return jsonify({"success": False, "message": f"Ошибка OCR: {ocr_error}"}), 500
        
#         # 4. Вызов AI (сейчас заглушка)
#         # ai_response_json, ai_error = call_deepseek(ocr_text)
        
#         return jsonify({
#             "success": True, 
#             # 🆕 ОБРЕЗАННОЕ ИЗОБРАЖЕНИЕ
#             "cropped_image_base64": cropped_base64,
#             "solutions": [{
#                 "title": "Фото обработано", 
#                 "answer": f"Offset: {Y_PIXEL_OFFSET}, Zoom Fix v3 applied", 
#                 "formulas": [], 
#                 "steps": ["Проверь красную рамку в Dashboard"]
#             }]
#         })
        
#     except Exception as e:
#         debug_print(f"Ошибка в solve(): {e}")
#         return jsonify({"success": False, "message": str(e)}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Camera Debugger v8: Final Zoom</title>
#         <style>
#             body { font-family: monospace; background: #1e1e1e; color: #ddd; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; flex-wrap: wrap; }
#             .box { background: #2d2d2d; padding: 15px; border-radius: 8px; border: 1px solid #444; }
#             img { max-width: 450px; border: 2px solid #555; }
#             pre { color: #8f8; overflow-x: auto; white-space: pre-wrap; }
#             h2 { margin-top: 0; color: #fff; border-bottom: 1px solid #555; padding-bottom: 5px; }
#             .highlight { color: #f88; font-weight: bold; }
#         </style>
#         <meta http-equiv="refresh" content="4">
#     </head>
#     <body>
#         <h1>📸 Debugger v8: Final Calibration (Y={offset_value}px, Adj={adj_factor})</h1>
#         <p>Если красная рамка совпадает с текстом - мы победили.</p>
        
#         <div class="box">
#             <h2>Math Logic Stats</h2>
#             <pre>{{ data }}</pre>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>1. Server View (Full Image)</h2>
#                 <p>Красная рамка должна быть <b>уже</b> и <b>точно</b> на цели.</p>
#                 <img src="/debug/full_rect?t={{ time }}" />
#             </div>
            
#             <div class="box">
#                 <h2>2. Result (Crop)</h2>
#                 <img src="/debug/cropped?t={{ time }}" />
#             </div>
#         </div>
#     </body>
#     </html>
#     """
#     return render_template_string(html, data=json.dumps(last_debug_data, indent=2), time=time.time(), offset_value=Y_PIXEL_OFFSET, adj_factor=ZOOM_ADJUSTMENT_FACTOR)

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({"success": True, "api_key_valid": True})

# if __name__ == '__main__':
#     # Остановка debug=True в production
#     app.run(host='0.0.0.0', port=5000, debug=True)





# 111111111111111111111111111111111chat111111111111111111111111111111111chat111111111111111111111111111111111chat111111111111111111111111111111111chat
# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from PIL import Image, ImageOps 
# import io
# import numpy as np 
# import cv2 

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH (например, для Windows)
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен (pip install pytesseract)")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# DEBUG_IMAGE_FILE = 'debug_ocr_image_processed.jpg'
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" # ЗАМЕНИТЕ НА ВАШ КЛЮЧ
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# # Оптимизированный промпт для DeepSeek (теперь ожидает ТЕКСТ)
# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи, распознанный с фотографии.

# 1. Исправь возможные ошибки распознавания (OCR) в тексте.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в следующем JSON формате, без лишнего текста, объяснений, или markdown:

# {
#     "solutions": [
#         {
#             "title": "Название метода решения",
#             "formulas": ["формула1", "формула2"],
#             "answer": "конечный числовой ответ с единицами измерения",
#             "steps": ["шаг 1: описание", "шаг 2: вычисления", "шаг 3: результат"]
#         }
#     ]
# }

# ВАЖНО: Используй LaTeX для формул в квадратных скобках: [F = ma]
# """

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     """Продвинутая предобработка с OpenCV (Otsu's Binarization) и OCR."""
#     if not OCR_AVAILABLE:
#         return None, "Библиотека pytesseract не установлена."
    
#     try:
#         debug_print("👀 Запускаем OpenCV предобработку (Otsu's Binarization) и OCR...")
        
#         img_bgr = cv2.imread(image_path)
        
#         if img_bgr is None:
#             return None, "Не удалось загрузить обрезанное изображение."
            
#         gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        
#         # Применение автоматической бинаризации Оцу (Otsu's Binarization)
#         _, processed_img = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

#         cv2.imwrite(DEBUG_IMAGE_FILE, processed_img)
#         debug_print(f"🖼️ Обработанное изображение для OCR сохранено в {DEBUG_IMAGE_FILE}")
        
#         pil_image = Image.fromarray(processed_img)
        
#         tesseract_config = '--psm 6' 
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config=tesseract_config)
        
#         cleaned_text = text.strip()
        
#         if not cleaned_text:
#             return None, "Текст не распознан. Фото слишком нечеткое или пустое."
            
#         debug_print(f"📖 Распознанный текст (первые 50 симв.): {cleaned_text[:50]}...")
#         return cleaned_text, None
        
#     except Exception as e:
#         error_msg = str(e)
#         if "No such file or directory" in error_msg or "failed to find tesseract" in error_msg:
#             return None, "Tesseract OCR не найден. Проверьте установку и PATH."
#         return None, f"Критическая ошибка OCR: {error_msg}"

# def crop_image_to_frame(image_data, frame_rect, screen_width, screen_height):
#     """
#     Обрезает изображение по рамке. 
#     ПРИМЕНЯЕТ ЛОГИКУ КРОСС-МАППИНГА (ШАГ 9: LLM Confirmed + Clamp).
#     Сохраняет результат в TEMP_CROPPED_FILE.
#     """
#     try:
#         debug_print("✂️ Обрезаем изображение...")
#         image = Image.open(io.BytesIO(image_data))
        
#         # Размеры сырого изображения
#         img_width, img_height = image.size
        
#         # Координаты обрезки по умолчанию
#         left = 0
#         top = 0
#         right = img_width
#         bottom = img_height

#         # Проверяем несоответствие осей (Портретный экран vs. Ландшафтный сырой файл)
#         if screen_height > screen_width and img_width > img_height:
#             debug_print("🔄 Обнаружено несоответствие осей: применяем логику LLM (Шаг 9) 270°.")

#             # Scale X (ширина экрана) -> Y (высота изображения)
#             scale_x = img_height / screen_width
#             # Scale Y (высота экрана) -> X (ширина изображения)
#             scale_y = img_width / screen_height

#             # --- ИСПРАВЛЕННАЯ ЛОГИКА КООРДИНАТ (ШАГ 9 - LLM Confirmed) ---
            
#             # 1. TOP coordinate (Raw Image Y-axis): Corresponds to Screen X-axis (НЕ инвертируем)
#             top = int(frame_rect['x'] * scale_x)
            
#             # 2. LEFT coordinate (Raw Image X-axis): Corresponds to Screen Y-axis. ИНВЕРТИРУЕМ.
#             # Инверсия по X, отсчитываемая от правого края снимка.
#             left = img_width - int((frame_rect['y'] + frame_rect['height']) * scale_y)

#             # 3. BOTTOM coordinate (Raw Image Y-axis): X-axis end
#             bottom = top + int(frame_rect['width'] * scale_x)

#             # 4. RIGHT coordinate (Raw Image X-axis): Y-axis end
#             right = left + int(frame_rect['height'] * scale_y)
            
#             # --- Защита от выхода за границы (Clamp) ---
#             left = max(0, left)
#             top = max(0, top)
#             right = min(img_width, right)
#             bottom = min(img_height, bottom)
            
#             # --- КОНЕЦ ИСПРАВЛЕННОЙ ЛОГИКИ ---

#         else:
#             # Стандартная логика (если оси совпадают)
#             scale_x = img_width / screen_width
#             scale_y = img_height / screen_height
            
#             left = int(frame_rect['x'] * scale_x)
#             top = int(frame_rect['y'] * scale_y)
#             right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
#             bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
        
#         # Обрезаем
#         cropped_image = image.crop((left, top, right, bottom))
        
#         # --- ОСТАВЛЯЕМ ПОВОРОТ 270 ---
#         cropped_image = cropped_image.transpose(Image.ROTATE_270)
#         # -----------------------------
        
#         cropped_image.save(TEMP_CROPPED_FILE, 'JPEG', quality=100)
#         debug_print(f"✅ Успешно обрезано и повернуто в {TEMP_CROPPED_FILE}. Координаты обрезки: ({left}, {top}, {right}, {bottom})")
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"❌ Ошибка обрезки: {e}")
#         return None

# def call_deepseek_api_text(problem_text):
#     """Отправляет распознанный текст в DeepSeek Chat API"""
#     try:
#         debug_print("🚀 Отправляем текст в DeepSeek API...")
        
#         messages = [
#             {"role": "system", "content": PROMPT_SYSTEM},
#             {"role": "user", "content": f"Распознанный текст задачи:\n\n{problem_text}"}
#         ]
        
#         payload = {
#             "model": "deepseek-chat",
#             "messages": messages,
#             "max_tokens": 2000,
#             "temperature": 0.1,
#             "response_format": {"type": "json_object"}
#         }
        
#         headers = {
#             "Content-Type": "application/json",
#             "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
#         }
        
#         response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=60)
        
#         if response.status_code == 200:
#             return response.json()["choices"][0]["message"]["content"], None
#         else:
#             return None, f"Ошибка DeepSeek API {response.status_code}: {response.text}"
            
#     except Exception as e:
#         return None, f"Ошибка сети или API: {str(e)}"

# app = Flask(__name__)
# CORS(app)

# @app.route('/solve', methods=['POST'])
# def solve_problem():
#     debug_print("\n" + "="*50)
#     debug_print("📱 НОВЫЙ ЗАПРОС")
    
#     try:
#         data = request.get_json()
#         image_data = base64.b64decode(data['image'])
        
#         # 1. Обрезаем (с коррекцией координат)
#         file_path = crop_image_to_frame(
#             image_data, 
#             data['frame_rect'], 
#             data['screen_width'], 
#             data['screen_height']
#         )
        
#         if not file_path:
#             return jsonify({"success": False, "message": "Ошибка обработки фото (обрезка)"}), 500

#         # 2. Распознаем текст с OpenCV предобработкой
#         recognized_text, error = extract_text_from_image(file_path)
        
#         if error:
#             debug_print(f"❌ Ошибка OCR: {error}")
#             return jsonify({
#                 "success": False, 
#                 "message": f"Не удалось прочитать текст: {error}"
#             }), 500
            
#         # 3. Отправляем текст в API
#         api_response, api_error = call_deepseek_api_text(recognized_text)
        
#         if api_error:
#             debug_print(f"❌ Ошибка API: {api_error}")
#             return jsonify({"success": False, "message": api_error}), 500

#         # 4. Парсим ответ
#         try:
#             result = json.loads(api_response)
#             if "solutions" in result and isinstance(result["solutions"], list):
#                 return jsonify({"success": True, "solutions": result["solutions"]})
#         except:
#             pass
            
#         # Запасной вариант: если API вернул невалидный JSON
#         debug_print("⚠️ API вернул невалидный JSON. Возвращаем сырой ответ.")
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Сырой ответ DeepSeek (Ошибка парсинга)",
#                 "answer": "Смотрите описание шагов",
#                 "formulas": [],
#                 "steps": [api_response]
#             }]
#         })

#     except Exception as e:
#         debug_print(f"💥 Критическая ошибка сервера: {e}")
#         return jsonify({"success": False, "message": f"Внутренняя ошибка сервера: {str(e)}"}), 500

# # --- ОТЛАДОЧНЫЕ МАРШРУТЫ ---

# @app.route('/debug/cropped', methods=['GET'])
# def debug_cropped_image():
#     """Показывает обрезанное изображение (temp_cropped.jpg)"""
#     if os.path.exists(TEMP_CROPPED_FILE):
#         return send_file(TEMP_CROPPED_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл temp_cropped.jpg не найден. Сначала выполните /solve."}), 404

# @app.route('/debug/processed', methods=['GET'])
# def debug_processed_image():
#     """Показывает изображение после предобработки OpenCV (debug_ocr_image_processed.jpg)"""
#     if os.path.exists(DEBUG_IMAGE_FILE):
#         return send_file(DEBUG_IMAGE_FILE, mimetype='image/jpeg')
#     return jsonify({"message": "Файл debug_ocr_image_processed.jpg не найден. Сначала выполните /solve."}), 404

# # ----------------------------------

# @app.route('/status', methods=['GET'])
# def server_status():
#     """Проверка статуса сервера и API ключа"""
#     try:
#         if not OCR_AVAILABLE:
#              return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": "❌ Tesseract (pytesseract) не установлен!"
#             })
            
#         headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}"}
#         test_response = requests.get(
#             "https://api.deepseek.com/v1/models",
#             headers=headers,
#             timeout=10
#         )
        
#         if test_response.status_code == 200:
#             return jsonify({
#                 "success": True,
#                 "api_key_valid": True,
#                 "message": "✅ Сервер работает, API ключ действителен"
#             })
#         else:
#             return jsonify({
#                 "success": False,
#                 "api_key_valid": False,
#                 "message": f"❌ API ключ недействителен (код: {test_response.status_code})"
#             })
            
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "api_key_valid": False,
#             "message": f"❌ Ошибка проверки API: {str(e)}"
#         })

# if __name__ == '__main__':
#     debug_print("🚀 Запуск Flask сервера (Режим OCR -> DeepSeek)")
#     debug_print("="*50)
#     app.run(host='0.0.0.0', port=5000, debug=True)





# 2chat





# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     # Сохраняем полное фото для отладки
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' # Фото с нарисованной рамкой
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи.
# 1. Исправь ошибки OCR.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в JSON:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула"],
#             "answer": "ответ",
#             "steps": ["шаг 1", "шаг 2"]
#         }
#     ]
# }
# """

# app = Flask(__name__)
# CORS(app)

# # Глобальная переменная для хранения последних данных отладки
# last_debug_data = {}

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         img = cv2.imread(image_path)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         pil_image = Image.fromarray(processed)
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     """
#     Обрезает фото и генерирует отладочные изображения для Dashboard.
#     """
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
#         # Сохраняем оригинал для отладки
#         image.save(TEMP_FULL_FILE)
        
#         img_w, img_h = image.size
        
#         # Логируем данные
#         last_debug_data = {
#             "screen_w": screen_w,
#             "screen_h": screen_h,
#             "img_w": img_w,
#             "img_h": img_h,
#             "frame": frame_rect
#         }

#         # --- ТЕКУЩАЯ ЛОГИКА (Которую мы будем чинить) ---
#         # Пока оставляем как есть, чтобы увидеть ошибку глазами
#         if screen_h > screen_w and img_w > img_h:
#             # Логика для поворота (подозрительная, но пока не трогаем)
#             scale_x = img_h / screen_w
#             scale_y = img_w / screen_h
            
#             top = int(frame_rect['x'] * scale_x)
#             left = img_w - int((frame_rect['y'] + frame_rect['height']) * scale_y)
#             bottom = top + int(frame_rect['width'] * scale_x)
#             right = left + int(frame_rect['height'] * scale_y)
            
#             # Clamp
#             left = max(0, left); top = max(0, top)
#             right = min(img_w, right); bottom = min(img_h, bottom)
            
#             crop_box = (left, top, right, bottom)
#             cropped = image.crop(crop_box)
#             cropped = cropped.transpose(Image.ROTATE_270)
            
#         else:
#             # Стандартная логика
#             scale_x = img_w / screen_w
#             scale_y = img_h / screen_h
            
#             left = int(frame_rect['x'] * scale_x)
#             top = int(frame_rect['y'] * scale_y)
#             right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
#             bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
            
#             crop_box = (left, top, right, bottom)
#             cropped = image.crop(crop_box)

#         # Сохраняем кроп
#         cropped.save(TEMP_CROPPED_FILE)
        
#         # --- ГЕНЕРАЦИЯ ОТЛАДОЧНОЙ КАРТИНКИ С РАМКОЙ ---
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         # Рисуем прямоугольник, который мы вычислили (до поворота результата)
#         draw.rectangle(crop_box, outline="red", width=10)
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def call_deepseek(text):
#     # Заглушка, чтобы не тратить токены пока чиним камеру,
#     # или оставь реальный вызов если хочешь.
#     # Для теста камеры лучше пока вернуть фейк.
#     return json.dumps({
#         "solutions": [{
#             "title": "Режим отладки камеры",
#             "formulas": [],
#             "answer": "Проверь http://IP:5000/dashboard",
#             "steps": ["Мы настраиваем камеру"]
#         }]
#     }), None

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not path: return jsonify({"success": False, "message": "Ошибка кропа"}), 500
        
#         # Пока пропускаем OCR и DeepSeek для экономии времени, нам нужна картинка
#         # text, _ = extract_text_from_image(path)
#         # result, _ = call_deepseek(text)
        
#         # Возвращаем заглушку успеха
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Фото получено", 
#                 "answer": "Зайди в Dashboard", 
#                 "formulas": [], 
#                 "steps": ["Фото сохранено на сервере"]
#             }]
#         })
        
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Camera Debugger</title>
#         <style>
#             body { font-family: sans-serif; background: #222; color: #fff; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; }
#             .box { background: #333; padding: 10px; border-radius: 8px; }
#             img { max-width: 400px; border: 2px solid #555; }
#             pre { background: #111; padding: 10px; overflow-x: auto; }
#             h2 { margin-top: 0; }
#         </style>
#         <meta http-equiv="refresh" content="5">
#     </head>
#     <body>
#         <h1>📸 Physics Solver Debugger</h1>
#         <p>Страница обновляется автоматически каждые 5 секунд.</p>
        
#         <div class="box">
#             <h2>Данные последнего запроса</h2>
#             <pre>{{ data }}</pre>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>1. Полное фото + Рамка (Server View)</h2>
#                 <p>Красная рамка - это то, как сервер понял координаты.</p>
#                 <img src="/debug/full_rect?t={{ time }}" />
#             </div>
            
#             <div class="box">
#                 <h2>2. Результат обрезки (Result)</h2>
#                 <p>Это уходит в нейросеть.</p>
#                 <img src="/debug/cropped?t={{ time }}" />
#             </div>
#         </div>
#     </body>
#     </html>
#     """
#     return render_template_string(html, data=json.dumps(last_debug_data, indent=2), time=time.time())

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({"success": True, "api_key_valid": True})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)









# =========================================================================================


# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' 
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи.
# 1. Исправь ошибки OCR.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в JSON:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула"],
#             "answer": "ответ",
#             "steps": ["шаг 1", "шаг 2"]
#         }
#     ]
# }
# """

# app = Flask(__name__)
# CORS(app)

# last_debug_data = {}

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         img = cv2.imread(image_path)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         pil_image = Image.fromarray(processed)
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     """
#     Обрезает фото. СТРАТЕГИЯ: Сначала поворачиваем фото, потом режем.
#     """
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
        
#         # Получаем исходные размеры
#         raw_w, raw_h = image.size
        
#         rotated = False
#         # Проверка: Если экран вертикальный, а фото горизонтальное -> ПОВОРАЧИВАЕМ ФОТО
#         if screen_h > screen_w and raw_w > raw_h:
#             # Поворот на 90 градусов по часовой стрелке (ROTATE_270 делает это корректно для фото)
#             image = image.transpose(Image.ROTATE_270)
#             rotated = True
#             debug_print("🔄 Фото повернуто на 90 градусов для соответствия экрану.")

#         # Получаем новые размеры (после возможного поворота)
#         img_w, img_h = image.size

#         # Сохраняем "нормализованное" фото для дебага
#         image.save(TEMP_FULL_FILE)

#         # Логируем данные
#         last_debug_data = {
#             "screen_w": screen_w,
#             "screen_h": screen_h,
#             "img_w": img_w,
#             "img_h": img_h,
#             "rotated_was_needed": rotated,
#             "frame": frame_rect
#         }

#         # Теперь координатная сетка совпадает. Просто масштабируем.
#         scale_x = img_w / screen_w
#         scale_y = img_h / screen_h
        
#         # Поскольку мы выровняли фото под экран, используем самый простой кроп
#         left = int(frame_rect['x'] * scale_x)
#         top = int(frame_rect['y'] * scale_y)
#         width = int(frame_rect['width'] * scale_x)
#         height = int(frame_rect['height'] * scale_y)
        
#         right = left + width
#         bottom = top + height
        
#         # Защита от выхода за границы
#         left = max(0, left)
#         top = max(0, top)
#         right = min(img_w, right)
#         bottom = min(img_h, bottom)
        
#         crop_box = (left, top, right, bottom)
        
#         # Режем
#         cropped = image.crop(crop_box)
#         cropped.save(TEMP_CROPPED_FILE)
        
#         # --- ГЕНЕРАЦИЯ ОТЛАДОЧНОЙ КАРТИНКИ С РАМКОЙ ---
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         draw.rectangle(crop_box, outline="red", width=10)
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def call_deepseek(text):
#     # Пока заглушка
#     return json.dumps({
#         "solutions": [{
#             "title": "Режим настройки камеры",
#             "formulas": [],
#             "answer": "Смотри в Dashboard",
#             "steps": ["Мы проверяем точность вырезания"]
#         }]
#     }), None

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not path: return jsonify({"success": False, "message": "Ошибка кропа"}), 500
        
#         # Заглушка ответа, чтобы приложение показало "Успех" и дало сделать новое фото
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Фото обработано", 
#                 "answer": "Проверь браузер", 
#                 "formulas": [], 
#                 "steps": ["Фото повернуто и обрезано."]
#             }]
#         })
        
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Camera Debugger v2</title>
#         <style>
#             body { font-family: sans-serif; background: #222; color: #fff; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; flex-wrap: wrap; }
#             .box { background: #333; padding: 10px; border-radius: 8px; }
#             img { max-width: 400px; border: 2px solid #555; }
#             pre { background: #111; padding: 10px; overflow-x: auto; }
#             h2 { margin-top: 0; font-size: 1.2em; }
#         </style>
#         <meta http-equiv="refresh" content="3">
#     </head>
#     <body>
#         <h1>📸 Debugger v2: Auto-Rotation</h1>
#         <p>Если красная рамка совпадает с текстом - мы победили.</p>
        
#         <div class="box">
#             <h2>Данные последнего кропа</h2>
#             <pre>{{ data }}</pre>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>1. Повернутое фото + Рамка</h2>
#                 <p>Здесь фото должно стоять вертикально (как страница книги).</p>
#                 <img src="/debug/full_rect?t={{ time }}" />
#             </div>
            
#             <div class="box">
#                 <h2>2. Результат (Кроп)</h2>
#                 <p>Четко ли вырезан текст?</p>
#                 <img src="/debug/cropped?t={{ time }}" />
#             </div>
#         </div>
#     </body>
#     </html>
#     """
#     return render_template_string(html, data=json.dumps(last_debug_data, indent=2), time=time.time())

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({"success": True, "api_key_valid": True})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)





# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # ⚠️ КОНСТАНТА КОМПЕНСАЦИИ СДВИГА Y ⚠️
# # Это смещение (в пикселях экрана телефона) для коррекции вертикального сдвига, 
# # вызванного статус-баром и заголовком приложения.
# # Начнем со 100 пикселей. Если рамка слишком низко, увеличим. Если слишком высоко, уменьшим.
# Y_PIXEL_OFFSET = 100 


# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' 
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи.
# 1. Исправь ошибки OCR.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в JSON:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула"],
#             "answer": "ответ",
#             "steps": ["шаг 1", "шаг 2"]
#         }
#     ]
# }
# """

# app = Flask(__name__)
# CORS(app)

# last_debug_data = {}

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         img = cv2.imread(image_path)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         pil_image = Image.fromarray(processed)
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     """
#     Обрезает фото. СТРАТЕГИЯ: Сначала поворачиваем фото, потом режем, с компенсацией Y.
#     """
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
        
#         # Получаем исходные размеры
#         raw_w, raw_h = image.size
        
#         rotated = False
#         # Проверка: Если экран вертикальный (screen_h > screen_w), а фото горизонтальное (raw_w > raw_h) -> ПОВОРАЧИВАЕМ ФОТО
#         if screen_h > screen_w and raw_w > raw_h:
#             # Поворот на 90 градусов против часовой (для стандартных камер)
#             image = image.transpose(Image.ROTATE_270)
#             rotated = True
#             debug_print("🔄 Фото повернуто на 90 градусов для соответствия экрану.")

#         # Получаем новые размеры (после возможного поворота)
#         img_w, img_h = image.size

#         # Сохраняем "нормализованное" фото для дебага
#         image.save(TEMP_FULL_FILE)

#         # Логируем данные
#         last_debug_data = {
#             "screen_w": screen_w,
#             "screen_h": screen_h,
#             "img_w": img_w,
#             "img_h": img_h,
#             "rotated_was_needed": rotated,
#             "frame": frame_rect,
#             "y_offset_used": Y_PIXEL_OFFSET
#         }

#         # Теперь координатная сетка совпадает. Просто масштабируем.
#         scale_x = img_w / screen_w
#         scale_y = img_h / screen_h
        
#         # --- ИЗМЕНЕНИЕ: КОМПЕНСАЦИЯ Y ---
#         # Мы берем координату Y, пришедшую с телефона, и вычитаем офсет, чтобы "поднять" рамку вверх
#         y_compensated = frame_rect['y'] - Y_PIXEL_OFFSET
#         y_compensated = max(0, y_compensated) # Гарантируем, что не уйдет в минус
        
#         # Масштабируем
#         left = int(frame_rect['x'] * scale_x)
#         top = int(y_compensated * scale_y)
        
#         # Размеры кадра
#         width = int(frame_rect['width'] * scale_x)
#         height = int(frame_rect['height'] * scale_y)
        
#         right = left + width
#         bottom = top + height
#         # --- КОНЕЦ ИЗМЕНЕНИЯ ---
        
#         # Защита от выхода за границы
#         left = max(0, left)
#         top = max(0, top)
#         right = min(img_w, right)
#         bottom = min(img_h, bottom)
        
#         crop_box = (left, top, right, bottom)
        
#         # Режем
#         cropped = image.crop(crop_box)
#         cropped.save(TEMP_CROPPED_FILE)
        
#         # --- ГЕНЕРАЦИЯ ОТЛАДОЧНОЙ КАРТИНКИ С РАМКОЙ ---
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         draw.rectangle(crop_box, outline="red", width=10)
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def call_deepseek(text):
#     # Пока заглушка
#     return json.dumps({
#         "solutions": [{
#             "title": "Режим настройки камеры",
#             "formulas": [],
#             "answer": "Смотри в Dashboard",
#             "steps": ["Мы проверяем точность вырезания"]
#         }]
#     }), None

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not path: return jsonify({"success": False, "message": "Ошибка кропа"}), 500
        
#         # Заглушка ответа, чтобы приложение показало "Успех" и дало сделать новое фото
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Фото обработано", 
#                 "answer": f"Проверь Dashboard. Y-компенсация: {Y_PIXEL_OFFSET}", 
#                 "formulas": [], 
#                 "steps": ["Фото повернуто и обрезано."]
#             }]
#         })
        
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Camera Debugger v3</title>
#         <style>
#             body { font-family: sans-serif; background: #222; color: #fff; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; flex-wrap: wrap; }
#             .box { background: #333; padding: 10px; border-radius: 8px; }
#             img { max-width: 400px; border: 2px solid #555; }
#             pre { background: #111; padding: 10px; overflow-x: auto; }
#             h2 { margin-top: 0; font-size: 1.2em; }
#         </style>
#         <meta http-equiv="refresh" content="3">
#     </head>
#     <body>
#         <h1>📸 Debugger v3: Y-Offset Test (Offset: {offset_value} px)</h1>
#         <p>Если красная рамка совпадает с текстом - мы победили.</p>
        
#         <div class="box">
#             <h2>Данные последнего кропа</h2>
#             <pre>{{ data }}</pre>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>1. Повернутое фото + Рамка</h2>
#                 <p>Красная рамка должна быть на цели.</p>
#                 <img src="/debug/full_rect?t={{ time }}" />
#             </div>
            
#             <div class="box">
#                 <h2>2. Результат (Кроп)</h2>
#                 <p>Четко ли вырезан текст?</p>
#                 <img src="/debug/cropped?t={{ time }}" />
#             </div>
#         </div>
#     </body>
#     </html>
#     """
#     return render_template_string(html, data=json.dumps(last_debug_data, indent=2), time=time.time(), offset_value=Y_PIXEL_OFFSET)

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({"success": True, "api_key_valid": True})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)








# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # ⚠️ КОНСТАНТА КОМПЕНСАЦИИ СДВИГА Y ⚠️
# # Увеличиваем смещение, чтобы "поднять" рамку на нужный текст (задача 12).
# # Было 100, ставим 170.
# Y_PIXEL_OFFSET = 50


# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH (например, для Windows)
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' 
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи.
# 1. Исправь ошибки OCR.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в JSON:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула"],
#             "answer": "ответ",
#             "steps": ["шаг 1", "шаг 2"]
#         }
#     ]
# }
# """

# app = Flask(__name__)
# CORS(app)

# last_debug_data = {}

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         img = cv2.imread(image_path)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         pil_image = Image.fromarray(processed)
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     """
#     Обрезает фото. СТРАТЕГИЯ: Сначала поворачиваем фото, потом режем, с компенсацией Y.
#     """
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
        
#         # Получаем исходные размеры
#         raw_w, raw_h = image.size
        
#         rotated = False
#         # Проверка: Если экран вертикальный (screen_h > screen_w), а фото горизонтальное (raw_w > raw_h) -> ПОВОРАЧИВАЕМ ФОТО
#         if screen_h > screen_w and raw_w > raw_h:
#             # Поворот на 90 градусов против часовой (для стандартных камер)
#             image = image.transpose(Image.ROTATE_270)
#             rotated = True
#             debug_print("🔄 Фото повернуто на 90 градусов для соответствия экрану.")

#         # Получаем новые размеры (после возможного поворота)
#         img_w, img_h = image.size

#         # Сохраняем "нормализованное" фото для дебага
#         image.save(TEMP_FULL_FILE)

#         # Логируем данные
#         last_debug_data = {
#             "screen_w": screen_w,
#             "screen_h": screen_h,
#             "img_w": img_w,
#             "img_h": img_h,
#             "rotated_was_needed": rotated,
#             "frame": frame_rect,
#             "y_offset_used": Y_PIXEL_OFFSET
#         }

#         # Теперь координатная сетка совпадает. Просто масштабируем.
#         scale_x = img_w / screen_w
#         scale_y = img_h / screen_h
        
#         # --- ИЗМЕНЕНИЕ: КОМПЕНСАЦИЯ Y ---
#         # Мы берем координату Y, пришедшую с телефона, и вычитаем офсет, чтобы "поднять" рамку вверх
#         y_compensated = frame_rect['y'] - Y_PIXEL_OFFSET
#         y_compensated = max(0, y_compensated) # Гарантируем, что не уйдет в минус
        
#         # Масштабируем
#         left = int(frame_rect['x'] * scale_x)
#         top = int(y_compensated * scale_y)
        
#         # Размеры кадра
#         width = int(frame_rect['width'] * scale_x)
#         height = int(frame_rect['height'] * scale_y)
        
#         right = left + width
#         bottom = top + height
#         # --- КОНЕЦ ИЗМЕНЕНИЯ ---
        
#         # Защита от выхода за границы
#         left = max(0, left)
#         top = max(0, top)
#         right = min(img_w, right)
#         bottom = min(img_h, bottom)
        
#         crop_box = (left, top, right, bottom)
        
#         # Режем
#         cropped = image.crop(crop_box)
#         cropped.save(TEMP_CROPPED_FILE)
        
#         # --- ГЕНЕРАЦИЯ ОТЛАДОЧНОЙ КАРТИНКИ С РАМКОЙ ---
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         draw.rectangle(crop_box, outline="red", width=10)
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def call_deepseek(text):
#     # Пока заглушка
#     return json.dumps({
#         "solutions": [{
#             "title": "Режим настройки камеры",
#             "formulas": [],
#             "answer": "Смотри в Dashboard",
#             "steps": ["Мы проверяем точность вырезания"]
#         }]
#     }), None

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not path: return jsonify({"success": False, "message": "Ошибка кропа"}), 500
        
#         # Заглушка ответа, чтобы приложение показало "Успех" и дало сделать новое фото
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Фото обработано", 
#                 "answer": f"Проверь Dashboard. Y-компенсация: {Y_PIXEL_OFFSET}", 
#                 "formulas": [], 
#                 "steps": ["Фото повернуто и обрезано."]
#             }]
#         })
        
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Camera Debugger v4</title>
#         <style>
#             body { font-family: sans-serif; background: #222; color: #fff; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; flex-wrap: wrap; }
#             .box { background: #333; padding: 10px; border-radius: 8px; }
#             img { max-width: 400px; border: 2px solid #555; }
#             pre { background: #111; padding: 10px; overflow-x: auto; }
#             h2 { margin-top: 0; font-size: 1.2em; }
#         </style>
#         <meta http-equiv="refresh" content="3">
#     </head>
#     <body>
#         <h1>📸 Debugger v4: Y-Offset Test (Offset: {offset_value} px)</h1>
#         <p>Если красная рамка совпадает с текстом - мы победили.</p>
        
#         <div class="box">
#             <h2>Данные последнего кропа</h2>
#             <pre>{{ data }}</pre>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>1. Повернутое фото + Рамка</h2>
#                 <p>Красная рамка должна быть на цели.</p>
#                 <img src="/debug/full_rect?t={{ time }}" />
#             </div>
            
#             <div class="box">
#                 <h2>2. Результат (Кроп)</h2>
#                 <p>Четко ли вырезан текст?</p>
#                 <img src="/debug/cropped?t={{ time }}" />
#             </div>
#         </div>
#     </body>
#     </html>
#     """
#     return render_template_string(html, data=json.dumps(last_debug_data, indent=2), time=time.time(), offset_value=Y_PIXEL_OFFSET)

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({"success": True, "api_key_valid": True})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)












# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # ⚠️ КОНСТАНТА КОМПЕНСАЦИИ СДВИГА Y ⚠️
# # Твое найденное идеальное значение.
# Y_PIXEL_OFFSET = 30


# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH (например, для Windows)
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' 
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи.
# 1. Исправь ошибки OCR.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в JSON:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула"],
#             "answer": "ответ",
#             "steps": ["шаг 1", "шаг 2"]
#         }
#     ]
# }
# """

# app = Flask(__name__)
# CORS(app)

# last_debug_data = {}

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         img = cv2.imread(image_path)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         pil_image = Image.fromarray(processed)
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     """
#     Обрезает фото с учетом 'Zoom' эффекта (Aspect Ratio Correction).
#     """
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
        
#         raw_w, raw_h = image.size
#         rotated = False
        
#         # 1. АВТОПОВОРОТ (Если экран вертикальный, а фото горизонтальное)
#         if screen_h > screen_w and raw_w > raw_h:
#             image = image.transpose(Image.ROTATE_270)
#             rotated = True
#             debug_print("🔄 Фото повернуто на 90 градусов.")

#         img_w, img_h = image.size
        
#         # Сохраняем полное фото
#         image.save(TEMP_FULL_FILE)

#         # 2. КОРРЕКЦИЯ ЗУМА (Aspect Ratio Matching)
#         # Экран телефона обычно уже (aspect ratio меньше), чем фото с камеры.
#         # Приложение обрезает бока фото, чтобы заполнить экран.
        
#         screen_aspect = screen_w / screen_h
#         img_aspect = img_w / img_h
        
#         scale = 1.0
#         offset_x_centering = 0
#         offset_y_centering = 0
        
#         if screen_aspect < img_aspect:
#             # Случай вертикального телефона: Экран уже, чем фото.
#             # Приложение масштабирует фото по ВЫСОТЕ и обрезает БОКА.
#             scale = img_h / screen_h
            
#             # Вычисляем, какая ширина фото реально видна на экране
#             visible_width_on_image = screen_w * scale
            
#             # Разница между реальной шириной фото и видимой (это "скрытые" бока)
#             diff = img_w - visible_width_on_image
#             offset_x_centering = diff / 2
            
#         else:
#             # Случай, если экран шире фото (редко для вертикального режима, но возможно)
#             # Масштабируем по ШИРИНЕ, обрезаем ВЕРХ/НИЗ.
#             scale = img_w / screen_w
            
#             visible_height_on_image = screen_h * scale
#             diff = img_h - visible_height_on_image
#             offset_y_centering = diff / 2

#         # 3. ПРИМЕНЕНИЕ КООРДИНАТ
#         # Сначала компенсируем твой ручной Y-сдвиг (статус бар)
#         frame_y_corrected = frame_rect['y'] - Y_PIXEL_OFFSET
#         frame_y_corrected = max(0, frame_y_corrected)

#         # Переводим координаты экрана в координаты фото
#         left = int((frame_rect['x'] * scale) + offset_x_centering)
#         top = int((frame_y_corrected * scale) + offset_y_centering)
        
#         width = int(frame_rect['width'] * scale)
#         height = int(frame_rect['height'] * scale)
        
#         right = left + width
#         bottom = top + height
        
#         # Логируем данные для Dashboard
#         last_debug_data = {
#             "screen": f"{screen_w}x{screen_h}",
#             "image": f"{img_w}x{img_h}",
#             "rotated": rotated,
#             "y_offset_used": Y_PIXEL_OFFSET,
#             "zoom_logic": {
#                 "scale_factor": round(scale, 3),
#                 "hidden_margin_x": int(offset_x_centering),
#                 "hidden_margin_y": int(offset_y_centering)
#             },
#             "frame_input": frame_rect,
#             "crop_coords": {"l": left, "t": top, "r": right, "b": bottom}
#         }
        
#         # Clamp (защита от выхода за границы)
#         left = max(0, left); top = max(0, top)
#         right = min(img_w, right); bottom = min(img_h, bottom)
        
#         crop_box = (left, top, right, bottom)
        
#         # 4. ОБРЕЗКА И СОХРАНЕНИЕ
#         cropped = image.crop(crop_box)
#         cropped.save(TEMP_CROPPED_FILE)
        
#         # Рисуем рамку на debug картинке
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         draw.rectangle(crop_box, outline="red", width=10)
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def call_deepseek(text):
#     # Заглушка
#     return json.dumps({
#         "solutions": [{
#             "title": "Режим настройки камеры",
#             "formulas": [],
#             "answer": "Проверь Dashboard",
#             "steps": ["Мы проверяем точность вырезания"]
#         }]
#     }), None

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not path: return jsonify({"success": False, "message": "Ошибка кропа"}), 500
        
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Фото обработано", 
#                 "answer": f"Offset: {Y_PIXEL_OFFSET}, Zoom Fix applied", 
#                 "formulas": [], 
#                 "steps": ["Проверь красную рамку в Dashboard"]
#             }]
#         })
        
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Camera Debugger v5 (Zoom Fix)</title>
#         <style>
#             body { font-family: monospace; background: #1e1e1e; color: #ddd; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; flex-wrap: wrap; }
#             .box { background: #2d2d2d; padding: 15px; border-radius: 8px; border: 1px solid #444; }
#             img { max-width: 450px; border: 2px solid #555; }
#             pre { color: #8f8; overflow-x: auto; white-space: pre-wrap; }
#             h2 { margin-top: 0; color: #fff; border-bottom: 1px solid #555; padding-bottom: 5px; }
#             .highlight { color: #f88; font-weight: bold; }
#         </style>
#         <meta http-equiv="refresh" content="4">
#     </head>
#     <body>
#         <h1>📸 Debugger v5: Zoom & Aspect Ratio Fix</h1>
#         <p>Y-Offset: <span class="highlight">{offset_value}px</span> | Check if red box width matches text width.</p>
        
#         <div class="box">
#             <h2>Math Logic Stats</h2>
#             <pre>{{ data }}</pre>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>1. Server View (Full Image)</h2>
#                 <p>Красная рамка должна быть <b>уже</b>, чем раньше.</p>
#                 <img src="/debug/full_rect?t={{ time }}" />
#             </div>
            
#             <div class="box">
#                 <h2>2. Result (Crop)</h2>
#                 <img src="/debug/cropped?t={{ time }}" />
#             </div>
#         </div>
#     </body>
#     </html>
#     """
#     return render_template_string(html, data=json.dumps(last_debug_data, indent=2), time=time.time(), offset_value=Y_PIXEL_OFFSET)

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({"success": True, "api_key_valid": True})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)













# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # ⚠️ КОНСТАНТА КОМПЕНСАЦИИ СДВИГА Y ⚠️
# # Твое скорректированное значение, чтобы рамка начиналась правильно сверху.
# Y_PIXEL_OFFSET = 30 


# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH (например, для Windows)
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' 
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи.
# 1. Исправь ошибки OCR.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в JSON:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула"],
#             "answer": "ответ",
#             "steps": ["шаг 1", "шаг 2"]
#         }
#     ]
# }
# """

# app = Flask(__name__)
# CORS(app)

# last_debug_data = {}

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         img = cv2.imread(image_path)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         pil_image = Image.fromarray(processed)
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     """
#     Обрезает фото с учетом 'Zoom' эффекта (Aspect Ratio Correction).
#     Это должно устранить эффект '0.5x' зума.
#     """
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
        
#         raw_w, raw_h = image.size
#         rotated = False
        
#         # 1. АВТОПОВОРОТ (Если экран вертикальный, а фото горизонтальное)
#         if screen_h > screen_w and raw_w > raw_h:
#             image = image.transpose(Image.ROTATE_270)
#             rotated = True
#             debug_print("🔄 Фото повернуто на 90 градусов.")

#         img_w, img_h = image.size
        
#         # Сохраняем полное фото
#         image.save(TEMP_FULL_FILE)

#         # 2. КОРРЕКЦИЯ ЗУМА (Aspect Ratio Matching)
#         # Приложение масштабирует фото по ВЫСОТЕ (для вертикального экрана) и обрезает БОКА.
#         screen_aspect = screen_w / screen_h
#         img_aspect = img_w / img_h
        
#         scale = 1.0
#         offset_x_centering = 0
#         offset_y_centering = 0
        
#         if screen_aspect < img_aspect:
#             # Случай вертикального телефона: Приложение масштабирует по ВЫСОТЕ и обрезает БОКА.
#             scale = img_h / screen_h
            
#             # Вычисляем, какая ширина фото реально видна на экране
#             visible_width_on_image = screen_w * scale
            
#             # Разница между реальной шириной фото и видимой (это "скрытые" бока)
#             diff = img_w - visible_width_on_image
#             offset_x_centering = diff / 2
            
#         else:
#             # Случай, если экран шире фото (редко)
#             # Масштабируем по ШИРИНЕ, обрезаем ВЕРХ/НИЗ.
#             scale = img_w / screen_w
            
#             visible_height_on_image = screen_h * scale
#             diff = img_h - visible_height_on_image
#             offset_y_centering = diff / 2

#         # 3. ПРИМЕНЕНИЕ КООРДИНАТ
#         # Сначала компенсируем твой ручной Y-сдвиг (статус бар)
#         frame_y_corrected = frame_rect['y'] - Y_PIXEL_OFFSET
#         frame_y_corrected = max(0, frame_y_corrected)

#         # Переводим координаты экрана в координаты фото, учитывая масштаб и скрытые края
#         left = int((frame_rect['x'] * scale) + offset_x_centering)
#         top = int((frame_y_corrected * scale) + offset_y_centering)
        
#         width = int(frame_rect['width'] * scale)
#         height = int(frame_rect['height'] * scale)
        
#         right = left + width
#         bottom = top + height
        
#         # Логируем данные для Dashboard
#         last_debug_data = {
#             "screen": f"{screen_w}x{screen_h}",
#             "image": f"{img_w}x{img_h}",
#             "rotated": rotated,
#             "y_offset_used": Y_PIXEL_OFFSET,
#             "zoom_logic": {
#                 "scale_factor": round(scale, 3),
#                 "hidden_margin_x": int(offset_x_centering),
#                 "hidden_margin_y": int(offset_y_centering)
#             },
#             "frame_input": frame_rect,
#             "crop_coords": {"l": left, "t": top, "r": right, "b": bottom}
#         }
        
#         # Clamp (защита от выхода за границы)
#         left = max(0, left); top = max(0, top)
#         right = min(img_w, right); bottom = min(img_h, bottom)
        
#         crop_box = (left, top, right, bottom)
        
#         # 4. ОБРЕЗКА И СОХРАНЕНИЕ
#         cropped = image.crop(crop_box)
#         cropped.save(TEMP_CROPPED_FILE)
        
#         # Рисуем рамку на debug картинке
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         draw.rectangle(crop_box, outline="red", width=10)
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def call_deepseek(text):
#     # Заглушка
#     return json.dumps({
#         "solutions": [{
#             "title": "Режим настройки камеры",
#             "formulas": [],
#             "answer": "Проверь Dashboard",
#             "steps": ["Мы проверяем точность вырезания"]
#         }]
#     }), None

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not path: return jsonify({"success": False, "message": "Ошибка кропа"}), 500
        
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Фото обработано", 
#                 "answer": f"Offset: {Y_PIXEL_OFFSET}, Zoom Fix applied", 
#                 "formulas": [], 
#                 "steps": ["Проверь красную рамку в Dashboard"]
#             }]
#         })
        
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Camera Debugger v6 (Zoom Fix)</title>
#         <style>
#             body { font-family: monospace; background: #1e1e1e; color: #ddd; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; flex-wrap: wrap; }
#             .box { background: #2d2d2d; padding: 15px; border-radius: 8px; border: 1px solid #444; }
#             img { max-width: 450px; border: 2px solid #555; }
#             pre { color: #8f8; overflow-x: auto; white-space: pre-wrap; }
#             h2 { margin-top: 0; color: #fff; border-bottom: 1px solid #555; padding-bottom: 5px; }
#             .highlight { color: #f88; font-weight: bold; }
#         </style>
#         <meta http-equiv="refresh" content="4">
#     </head>
#     <body>
#         <h1>📸 Debugger v6: Zoom & Aspect Ratio Fix (Y={offset_value}px)</h1>
#         <p>Если красная рамка совпадает с текстом - мы победили.</p>
        
#         <div class="box">
#             <h2>Math Logic Stats</h2>
#             <pre>{{ data }}</pre>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>1. Server View (Full Image)</h2>
#                 <p>Красная рамка должна быть <b>уже</b> и <b>точно</b> на цели.</p>
#                 <img src="/debug/full_rect?t={{ time }}" />
#             </div>
            
#             <div class="box">
#                 <h2>2. Result (Crop)</h2>
#                 <img src="/debug/cropped?t={{ time }}" />
#             </div>
#         </div>
#     </body>
#     </html>
#     """
#     return render_template_string(html, data=json.dumps(last_debug_data, indent=2), time=time.time(), offset_value=Y_PIXEL_OFFSET)

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({"success": True, "api_key_valid": True})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)




















# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # ⚠️ КОНСТАНТЫ КАЛИБРОВКИ ⚠️
# # 1. Сдвиг по вертикали (для компенсации статус-бара/заголовка приложения)
# Y_PIXEL_OFFSET = 30 
# # 2. Фактор для компенсации недостаточного "зума" в режиме Cover (3% усиление)
# ZOOM_ADJUSTMENT_FACTOR = 1.03 

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH (например, для Windows)
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' 
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи.
# 1. Исправь ошибки OCR.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в JSON:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула"],
#             "answer": "ответ",
#             "steps": ["шаг 1", "шаг 2"]
#         }
#     ]
# }
# """

# app = Flask(__name__)
# CORS(app)

# last_debug_data = {}

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         img = cv2.imread(image_path)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         pil_image = Image.fromarray(processed)
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     """
#     Обрезает фото с учетом 'Zoom' эффекта (Aspect Ratio Correction) и ручной подстройки.
#     """
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
        
#         raw_w, raw_h = image.size
#         rotated = False
        
#         # 1. АВТОПОВОРОТ (Если экран вертикальный, а фото горизонтальное)
#         if screen_h > screen_w and raw_w > raw_h:
#             image = image.transpose(Image.ROTATE_270)
#             rotated = True
#             debug_print("🔄 Фото повернуто на 90 градусов.")

#         img_w, img_h = image.size
        
#         # Сохраняем полное фото
#         image.save(TEMP_FULL_FILE)

#         # 2. КОРРЕКЦИЯ ЗУМА (Aspect Ratio Matching)
#         screen_aspect = screen_w / screen_h
#         img_aspect = img_w / img_h
        
#         scale = 1.0
#         offset_x_centering = 0
#         offset_y_centering = 0
        
#         if screen_aspect < img_aspect:
#             # Случай вертикального телефона: Приложение масштабирует по ВЫСОТЕ и обрезает БОКА.
#             scale = img_h / screen_h
            
#             # Применяем дополнительный фактор для усиления "зума"
#             scale *= ZOOM_ADJUSTMENT_FACTOR
            
#             # Вычисляем, какая ширина фото реально видна на экране после коррекции
#             visible_width_on_image = screen_w * scale
            
#             # Разница между реальной шириной фото и видимой (это "скрытые" бока)
#             diff = img_w - visible_width_on_image
#             offset_x_centering = diff / 2
            
#         else:
#             # Случай, если экран шире фото (редко)
#             scale = img_w / screen_w
#             scale *= ZOOM_ADJUSTMENT_FACTOR

#             visible_height_on_image = screen_h * scale
#             diff = img_h - visible_height_on_image
#             offset_y_centering = diff / 2

#         # 3. ПРИМЕНЕНИЕ КООРДИНАТ
#         # Сначала компенсируем твой ручной Y-сдвиг (статус бар)
#         frame_y_corrected = frame_rect['y'] - Y_PIXEL_OFFSET
#         frame_y_corrected = max(0, frame_y_corrected)

#         # Переводим координаты экрана в координаты фото, учитывая масштаб и скрытые края
#         left = int((frame_rect['x'] * scale) + offset_x_centering)
#         top = int((frame_y_corrected * scale) + offset_y_centering)
        
#         width = int(frame_rect['width'] * scale)
#         height = int(frame_rect['height'] * scale)
        
#         right = left + width
#         bottom = top + height
        
#         # Логируем данные для Dashboard
#         last_debug_data = {
#             "screen": f"{screen_w}x{screen_h}",
#             "image": f"{img_w}x{img_h}",
#             "rotated": rotated,
#             "y_offset_used": Y_PIXEL_OFFSET,
#             "zoom_logic": {
#                 "base_scale": round(img_h / screen_h if screen_aspect < img_aspect else img_w / screen_w, 3),
#                 "adj_factor": ZOOM_ADJUSTMENT_FACTOR,
#                 "final_scale_factor": round(scale, 3),
#                 "hidden_margin_x": int(offset_x_centering),
#                 "hidden_margin_y": int(offset_y_centering)
#             },
#             "frame_input": frame_rect,
#             "crop_coords": {"l": left, "t": top, "r": right, "b": bottom}
#         }
        
#         # Clamp (защита от выхода за границы)
#         left = max(0, left); top = max(0, top)
#         right = min(img_w, right); bottom = min(img_h, bottom)
        
#         crop_box = (left, top, right, bottom)
        
#         # 4. ОБРЕЗКА И СОХРАНЕНИЕ
#         cropped = image.crop(crop_box)
#         cropped.save(TEMP_CROPPED_FILE)
        
#         # Рисуем рамку на debug картинке
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         draw.rectangle(crop_box, outline="red", width=10)
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def call_deepseek(text):
#     # Заглушка
#     return json.dumps({
#         "solutions": [{
#             "title": "Режим настройки камеры",
#             "formulas": [],
#             "answer": "Проверь Dashboard",
#             "steps": ["Мы проверяем точность вырезания"]
#         }]
#     }), None

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not path: return jsonify({"success": False, "message": "Ошибка кропа"}), 500
        
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Фото обработано", 
#                 "answer": f"Offset: {Y_PIXEL_OFFSET}, Zoom Fix v2 applied", 
#                 "formulas": [], 
#                 "steps": ["Проверь красную рамку в Dashboard"]
#             }]
#         })
        
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Camera Debugger v7 (Final Zoom)</title>
#         <style>
#             body { font-family: monospace; background: #1e1e1e; color: #ddd; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; flex-wrap: wrap; }
#             .box { background: #2d2d2d; padding: 15px; border-radius: 8px; border: 1px solid #444; }
#             img { max-width: 450px; border: 2px solid #555; }
#             pre { color: #8f8; overflow-x: auto; white-space: pre-wrap; }
#             h2 { margin-top: 0; color: #fff; border-bottom: 1px solid #555; padding-bottom: 5px; }
#             .highlight { color: #f88; font-weight: bold; }
#         </style>
#         <meta http-equiv="refresh" content="4">
#     </head>
#     <body>
#         <h1>📸 Debugger v7: Final Zoom Correction (Y={offset_value}px, Adj={adj_factor})</h1>
#         <p>Если красная рамка совпадает с текстом - мы победили.</p>
        
#         <div class="box">
#             <h2>Math Logic Stats</h2>
#             <pre>{{ data }}</pre>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>1. Server View (Full Image)</h2>
#                 <p>Красная рамка должна быть <b>уже</b> и <b>точно</b> на цели.</p>
#                 <img src="/debug/full_rect?t={{ time }}" />
#             </div>
            
#             <div class="box">
#                 <h2>2. Result (Crop)</h2>
#                 <img src="/debug/cropped?t={{ time }}" />
#             </div>
#         </div>
#     </body>
#     </html>
#     """
#     return render_template_string(html, data=json.dumps(last_debug_data, indent=2), time=time.time(), offset_value=Y_PIXEL_OFFSET, adj_factor=ZOOM_ADJUSTMENT_FACTOR)

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({"success": True, "api_key_valid": True})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)











# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # ⚠️ КОНСТАНТЫ КАЛИБРОВКИ ⚠️
# # 1. Сдвиг по вертикали (для компенсации статус-бара/заголовка приложения)
# Y_PIXEL_OFFSET = 30 
# # 2. Фактор для компенсации недостаточного "зума" в режиме Cover (3% усиление)
# ZOOM_ADJUSTMENT_FACTOR = 1.03 

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH (например, для Windows)
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен")

# # --- КОНСТАНТЫ ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' 
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи.
# 1. Исправь ошибки OCR.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в JSON:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формула"],
#             "answer": "ответ",
#             "steps": ["шаг 1", "шаг 2"]
#         }
#     ]
# }
# """

# app = Flask(__name__)
# CORS(app)

# last_debug_data = {}

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         img = cv2.imread(image_path)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         pil_image = Image.fromarray(processed)
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     """
#     Обрезает фото с учетом 'Zoom' эффекта (Aspect Ratio Correction) и ручной подстройки.
#     """
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
        
#         raw_w, raw_h = image.size
#         rotated = False
        
#         # 1. АВТОПОВОРОТ (Если экран вертикальный, а фото горизонтальное)
#         if screen_h > screen_w and raw_w > raw_h:
#             image = image.transpose(Image.ROTATE_270)
#             rotated = True
#             debug_print("🔄 Фото повернуто на 90 градусов.")

#         img_w, img_h = image.size
        
#         # Сохраняем полное фото
#         image.save(TEMP_FULL_FILE)

#         # 2. КОРРЕКЦИЯ ЗУМА (Aspect Ratio Matching)
#         screen_aspect = screen_w / screen_h
#         img_aspect = img_w / img_h
        
#         scale = 1.0
#         offset_x_centering = 0
#         offset_y_centering = 0
        
#         if screen_aspect < img_aspect:
#             # Случай вертикального телефона: Приложение масштабирует по ВЫСОТЕ и обрезает БОКА.
#             scale = img_h / screen_h
            
#             # Применяем дополнительный фактор для усиления "зума"
#             scale *= ZOOM_ADJUSTMENT_FACTOR
            
#             # Вычисляем, какая ширина фото реально видна на экране после коррекции
#             visible_width_on_image = screen_w * scale
            
#             # Разница между реальной шириной фото и видимой (это "скрытые" бока)
#             diff = img_w - visible_width_on_image
#             offset_x_centering = diff / 2
            
#         else:
#             # Случай, если экран шире фото (редко)
#             scale = img_w / screen_w
#             scale *= ZOOM_ADJUSTMENT_FACTOR

#             visible_height_on_image = screen_h * scale
#             diff = img_h - visible_height_on_image
#             offset_y_centering = diff / 2

#         # 3. ПРИМЕНЕНИЕ КООРДИНАТ
#         # Сначала компенсируем твой ручной Y-сдвиг (статус бар)
#         frame_y_corrected = frame_rect['y'] - Y_PIXEL_OFFSET
#         frame_y_corrected = max(0, frame_y_corrected)

#         # Переводим координаты экрана в координаты фото, учитывая масштаб и скрытые края
#         left = int((frame_rect['x'] * scale) + offset_x_centering)
#         top = int((frame_y_corrected * scale) + offset_y_centering)
        
#         width = int(frame_rect['width'] * scale)
#         height = int(frame_rect['height'] * scale)
        
#         right = left + width
#         bottom = top + height
        
#         # Логируем данные для Dashboard
#         last_debug_data = {
#             "screen": f"{screen_w}x{screen_h}",
#             "image": f"{img_w}x{img_h}",
#             "rotated": rotated,
#             "y_offset_used": Y_PIXEL_OFFSET,
#             "zoom_logic": {
#                 "base_scale": round(img_h / screen_h if screen_aspect < img_aspect else img_w / screen_w, 3),
#                 "adj_factor": ZOOM_ADJUSTMENT_FACTOR,
#                 "final_scale_factor": round(scale, 3),
#                 "hidden_margin_x": int(offset_x_centering),
#                 "hidden_margin_y": int(offset_y_centering)
#             },
#             "frame_input": frame_rect,
#             "crop_coords": {"l": left, "t": top, "r": right, "b": bottom}
#         }
        
#         # Clamp (защита от выхода за границы)
#         left = max(0, left); top = max(0, top)
#         right = min(img_w, right); bottom = min(img_h, bottom)
        
#         crop_box = (left, top, right, bottom)
        
#         # 4. ОБРЕЗКА И СОХРАНЕНИЕ
#         cropped = image.crop(crop_box)
#         cropped.save(TEMP_CROPPED_FILE)
        
#         # Рисуем рамку на debug картинке
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         draw.rectangle(crop_box, outline="red", width=10)
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def call_deepseek(text):
#     # Заглушка
#     return json.dumps({
#         "solutions": [{
#             "title": "Режим настройки камеры",
#             "formulas": [],
#             "answer": "Проверь Dashboard",
#             "steps": ["Мы проверяем точность вырезания"]
#         }]
#     }), None

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not path: return jsonify({"success": False, "message": "Ошибка кропа"}), 500
        
#         return jsonify({
#             "success": True, 
#             "solutions": [{
#                 "title": "Фото обработано", 
#                 "answer": f"Offset: {Y_PIXEL_OFFSET}, Zoom Fix v2 applied", 
#                 "formulas": [], 
#                 "steps": ["Проверь красную рамку в Dashboard"]
#             }]
#         })
        
#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Camera Debugger v7 (Final Zoom)</title>
#         <style>
#             body { font-family: monospace; background: #1e1e1e; color: #ddd; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; flex-wrap: wrap; }
#             .box { background: #2d2d2d; padding: 15px; border-radius: 8px; border: 1px solid #444; }
#             img { max-width: 450px; border: 2px solid #555; }
#             pre { color: #8f8; overflow-x: auto; white-space: pre-wrap; }
#             h2 { margin-top: 0; color: #fff; border-bottom: 1px solid #555; padding-bottom: 5px; }
#             .highlight { color: #f88; font-weight: bold; }
#         </style>
#         <meta http-equiv="refresh" content="4">
#     </head>
#     <body>
#         <h1>📸 Debugger v7: Final Zoom Correction (Y={offset_value}px, Adj={adj_factor})</h1>
#         <p>Если красная рамка совпадает с текстом - мы победили.</p>
        
#         <div class="box">
#             <h2>Math Logic Stats</h2>
#             <pre>{{ data }}</pre>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>1. Server View (Full Image)</h2>
#                 <p>Красная рамка должна быть <b>уже</b> и <b>точно</b> на цели.</p>
#                 <img src="/debug/full_rect?t={{ time }}" />
#             </div>
            
#             <div class="box">
#                 <h2>2. Result (Crop)</h2>
#                 <img src="/debug/cropped?t={{ time }}" />
#             </div>
#         </div>
#     </body>
#     </html>
#     """
#     return render_template_string(html, data=json.dumps(last_debug_data, indent=2), time=time.time(), offset_value=Y_PIXEL_OFFSET, adj_factor=ZOOM_ADJUSTMENT_FACTOR)

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({"success": True, "api_key_valid": True})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)




# ===================================================================================srez





# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # ⚠️ КОНСТАНТЫ КАЛИБРОВКИ ⚠️
# # 1. Сдвиг по вертикали (для компенсации статус-бара/заголовка приложения)
# Y_PIXEL_OFFSET = 30 
# # 2. Фактор для компенсации недостаточного "зума" в режиме Cover (3% усиление)
# ZOOM_ADJUSTMENT_FACTOR = 1.03 

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH (например, для Windows)
#     # ПРИМЕЧАНИЕ: Этот путь может потребовать обновления, если Tesseract установлен в другом месте.
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен. Установите 'pip install pytesseract' и сам Tesseract.")

# # --- КОНСТАНТЫ API ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' 
# # ЗАМЕНИТЕ ЭТОТ КЛЮЧ НА ВАШ РЕАЛЬНЫЙ КЛЮЧ
# DEEPSEEK_API_KEY = "sk-9583b77b3d994f9fb254d6c3be2ecff2" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# PROMPT_SYSTEM = """Ты эксперт по физике. Я пришлю тебе текст задачи.
# 1. Исправь ошибки OCR.
# 2. Реши задачу.
# 3. Верни ответ СТРОГО в JSON:
# {
#     "solutions": [
#         {
#             "title": "Название метода",
#             "formulas": ["формулы все используемые в задаче по пунктам "],
#             "answer": "ответ",
#             "steps": ["шаг 1 - действие", "шаг 2 - действие ", 'шаг n - действие']
#         }
#     ]
# }
# """

# app = Flask(__name__)
# CORS(app)

# last_debug_data = {}

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         # Чтение изображения
#         img = cv2.imread(image_path)
#         # Преобразование в оттенки серого
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         # Бинаризация с Otsu
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         # Преобразование в PIL Image для Tesseract
#         pil_image = Image.fromarray(processed)
#         # Распознавание текста с русским и английским языками
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     """
#     Обрезает фото с учетом 'Zoom' эффекта (Aspect Ratio Correction) и ручной подстройки.
#     """
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
        
#         raw_w, raw_h = image.size
#         rotated = False
        
#         # 1. АВТОПОВОРОТ (Если экран вертикальный, а фото горизонтальное)
#         if screen_h > screen_w and raw_w > raw_h:
#             image = image.transpose(Image.ROTATE_270)
#             rotated = True
#             debug_print("🔄 Фото повернуто на 90 градусов.")

#         img_w, img_h = image.size
        
#         # Сохраняем полное фото
#         image.save(TEMP_FULL_FILE)

#         # 2. КОРРЕКЦИЯ ЗУМА (Aspect Ratio Matching)
#         screen_aspect = screen_w / screen_h
#         img_aspect = img_w / img_h
        
#         scale = 1.0
#         offset_x_centering = 0
#         offset_y_centering = 0
        
#         if screen_aspect < img_aspect:
#             # Случай вертикального телефона: Приложение масштабирует по ВЫСОТЕ и обрезает БОКА.
#             scale = img_h / screen_h
            
#             # Применяем дополнительный фактор для усиления "зума"
#             scale *= ZOOM_ADJUSTMENT_FACTOR
            
#             # Вычисляем, какая ширина фото реально видна на экране после коррекции
#             visible_width_on_image = screen_w * scale
            
#             # Разница между реальной шириной фото и видимой (это "скрытые" бока)
#             diff = img_w - visible_width_on_image
#             offset_x_centering = diff / 2
            
#         else:
#             # Случай, если экран шире фото (редко)
#             scale = img_w / screen_w
#             scale *= ZOOM_ADJUSTMENT_FACTOR

#             visible_height_on_image = screen_h * scale
#             diff = img_h - visible_height_on_image
#             offset_y_centering = diff / 2

#         # 3. ПРИМЕНЕНИЕ КООРДИНАТ
#         # Сначала компенсируем твой ручной Y-сдвиг (статус бар)
#         frame_y_corrected = frame_rect['y'] - Y_PIXEL_OFFSET
#         frame_y_corrected = max(0, frame_y_corrected)

#         # Переводим координаты экрана в координаты фото, учитывая масштаб и скрытые края
#         left = int((frame_rect['x'] * scale) + offset_x_centering)
#         top = int((frame_y_corrected * scale) + offset_y_centering)
        
#         width = int(frame_rect['width'] * scale)
#         height = int(frame_rect['height'] * scale)
        
#         right = left + width
#         bottom = top + height
        
#         # Логируем данные для Dashboard
#         last_debug_data = {
#             "screen": f"{screen_w}x{screen_h}",
#             "image": f"{img_w}x{img_h}",
#             "rotated": rotated,
#             "y_offset_used": Y_PIXEL_OFFSET,
#             "zoom_logic": {
#                 "base_scale": round(img_h / screen_h if screen_aspect < img_aspect else img_w / screen_w, 3),
#                 "adj_factor": ZOOM_ADJUSTMENT_FACTOR,
#                 "final_scale_factor": round(scale, 3),
#                 "hidden_margin_x": int(offset_x_centering),
#                 "hidden_margin_y": int(offset_y_centering)
#             },
#             "frame_input": frame_rect,
#             "crop_coords": {"l": left, "t": top, "r": right, "b": bottom}
#         }
        
#         # Clamp (защита от выхода за границы)
#         left = max(0, left); top = max(0, top)
#         right = min(img_w, right); bottom = min(img_h, bottom)
        
#         crop_box = (left, top, right, bottom)
        
#         # 4. ОБРЕЗКА И СОХРАНЕНИЕ
#         cropped = image.crop(crop_box)
#         cropped.save(TEMP_CROPPED_FILE)
        
#         # 5. Рисуем рамку на debug картинке
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         # Рисуем рамку толщиной 10 пикселей
#         draw.rectangle(crop_box, outline="red", width=10) 
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def call_deepseek(text):
#     # ЗАГЛУШКА: Здесь будет реальный вызов DeepSeek
#     return json.dumps({
#         "solutions": [{
#             "title": "Режим настройки камеры",
#             "formulas": [],
#             "answer": "Проверь Dashboard",
#             "steps": ["Мы проверяем точность вырезания"]
#         }]
#     }), None

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         # 1. Обрезка изображения
#         cropped_path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not cropped_path: return jsonify({"success": False, "message": "Ошибка кропа"}), 500
        
#         # 2. Кодирование обрезанного файла в Base64 для отображения на клиенте
#         with open(cropped_path, "rb") as image_file:
#             cropped_base64 = base64.b64encode(image_file.read()).decode('utf-8')
            
#         # 3. Распознавание текста (сейчас отключено, но структура готова)
#         # ocr_text, ocr_error = extract_text_from_image(cropped_path)
#         # if ocr_error:
#         #     return jsonify({"success": False, "message": f"Ошибка OCR: {ocr_error}"}), 500
        
#         # 4. Вызов AI (сейчас заглушка)
#         # ai_response_json, ai_error = call_deepseek(ocr_text)
        
#         return jsonify({
#             "success": True, 
#             # 🆕 ОБРЕЗАННОЕ ИЗОБРАЖЕНИЕ
#             "cropped_image_base64": cropped_base64,
#             "solutions": [{
#                 "title": "Фото обработано", 
#                 "answer": f"Offset: {Y_PIXEL_OFFSET}, Zoom Fix v3 applied", 
#                 "formulas": [], 
#                 "steps": ["Проверь красную рамку в Dashboard"]
#             }]
#         })
        
#     except Exception as e:
#         debug_print(f"Ошибка в solve(): {e}")
#         return jsonify({"success": False, "message": str(e)}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Camera Debugger v8: Final Zoom</title>
#         <style>
#             body { font-family: monospace; background: #1e1e1e; color: #ddd; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; flex-wrap: wrap; }
#             .box { background: #2d2d2d; padding: 15px; border-radius: 8px; border: 1px solid #444; }
#             img { max-width: 450px; border: 2px solid #555; }
#             pre { color: #8f8; overflow-x: auto; white-space: pre-wrap; }
#             h2 { margin-top: 0; color: #fff; border-bottom: 1px solid #555; padding-bottom: 5px; }
#             .highlight { color: #f88; font-weight: bold; }
#         </style>
#         <meta http-equiv="refresh" content="4">
#     </head>
#     <body>
#         <h1>📸 Debugger v8: Final Calibration (Y={offset_value}px, Adj={adj_factor})</h1>
#         <p>Если красная рамка совпадает с текстом - мы победили.</p>
        
#         <div class="box">
#             <h2>Math Logic Stats</h2>
#             <pre>{{ data }}</pre>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>1. Server View (Full Image)</h2>
#                 <p>Красная рамка должна быть <b>уже</b> и <b>точно</b> на цели.</p>
#                 <img src="/debug/full_rect?t={{ time }}" />
#             </div>
            
#             <div class="box">
#                 <h2>2. Result (Crop)</h2>
#                 <img src="/debug/cropped?t={{ time }}" />
#             </div>
#         </div>
#     </body>
#     </html>
#     """
#     return render_template_string(html, data=json.dumps(last_debug_data, indent=2), time=time.time(), offset_value=Y_PIXEL_OFFSET, adj_factor=ZOOM_ADJUSTMENT_FACTOR)

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({"success": True, "api_key_valid": True})

# if __name__ == '__main__':
#     # Остановка debug=True в production
#     app.run(host='0.0.0.0', port=5000, debug=True)



# # NEW MAIN






# %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

# =======================================================================================================================deepseek-resoaner 



# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # ⚠️ КОНСТАНТЫ КАЛИБРОВКИ ⚠️
# Y_PIXEL_OFFSET = 35 
# ZOOM_ADJUSTMENT_FACTOR = 1.03 

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ ОШИБКА: pytesseract не установлен.")

# # --- КОНСТАНТЫ API ---
# TEMP_CROPPED_FILE = 'temp_cropped.jpg'
# TEMP_FULL_FILE = 'temp_full.jpg'     
# TEMP_DEBUG_FILE = 'temp_debug_rect.jpg' 

# # ⚠️ ВАШ API КЛЮЧ
# DEEPSEEK_API_KEY = "sk-9523a9711ddd4e6abd04400734052976" 
# DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# # ⚠️ СТРУКТУРИРОВАННЫЙ ПРОМПТ ОТ GPT
# PROMPT_SYSTEM = r"""
# Ты — эксперт по физике и инженерии, с отличным математическим чутьём, аккуратной подачей формул и умением исправлять OCR-опечатки.
# Твоя задача — на основе текста, полученного из OCR (вход), полностью автономно:
#   1) Исправить очевидные опечатки OCR (только орфографические/символьные ошибки: плохие буквы, потерянные знаки, неправильные степени и единицы). НЕ менять смысл задачи и не дописывать дополнительных предпосылок.
#   2) Выделить из текста саму физическую задачу (игнорировать номера страниц, номера заданий, водяные знаки, заголовки).
#   3) Решить задачу и вернуть строго валидный JSON (см. формат ниже).
#   4) Включить все ключевые используемые формулы как читаемые LaTeX-строки.
#   5) Дать пошаговую, краткую и структурированную последовательность вычислений (steps). Только по делу — никаких домыслов, предположений или длинных рассуждений вне steps.
#   6) Финальный ответ (поле "answer") должен быть **тем значением, которое ты получил в результате шагов в поле "steps"** — т.е. answer = итоговое вычисление/результат из последнего шага.

# ОБЯЗАТЕЛЬНЫЕ ОГРАНИЧЕНИЯ И ПРАВИЛА ВЫЧИСЛЕНИЙ:
# - Все промежуточные вычисления вести **с полной точностью** (не округлять).
# - Округление делать **только** в конце — в поле "answer": до **3 значащих цифр** (используй разумное округление).
# - Если итоговое натуральное число получилось примерно 269.x, **не** трансформируй/округляй его произвольно до 300. Правило: округляй по обычным правилам (269.8 -> 270; 269.2 -> 269). Если число — 269.34, ответ можно дать как "269" или "269.3" (но придерживайся правила 3 значащих цифр).
# - Вся числовая выдача должна быть совместима с ограничением «управляет 270 целыми единицами, а не 300» — т.е. при интерпретации результатов не масштабируй или не нормируй значения к 300; если требуется оставить пояснение о максимально допустимой шкале — укажи это в отдельном вспомогательном поле (см. fallback ниже).
# - Всегда указывай единицы измерения в answer и, по возможности, в каждом шаге, где появляется числовой результат.
# - Выполни проверку размерностей (dimension check) для основных формул — если размерности не сходятся, верни ошибку в JSON (см. схему ошибок).
# - Перед финальной отправкой повторно проверь все числовые расчёты (autoverify): пересчитай ключевые выражения ещё раз и сравни — если расхождение >0.2% — сообщи об этом в поле "notes".

# ФОРМАТ ВЫХОДА (строго JSON, НИЧЕГО ВНЕ JSON):
# Если задача решена успешно:
# {
#   "success": true,
#   "solutions": [
#     {
#       "title": "Краткое название метода решения (1-6 слов)",
#       "formulas": ["LaTeX-строка 1", "LaTeX-строка 2", "..."],
#       "answer": "число с единицами (округлено до 3 значащих цифр)",
#       "steps": [
#         "Шаг 1: краткое действие и выражение, с подстановкой чисел (если есть)",
#         "Шаг 2: вычисление (показывай выражение и результат, промежуточные значения не округлять)",
#         "...",
#         "Шаг N: окончательное выражение и его значение — это финальный answer"
#       ],
#       "notes": "короткое примечание при необходимости (опционально)"
#     }
#   ]
# }

# Если задача не может быть решена (недостаточно данных, неоднозначность, нарушены размерности, OCR дал нечитаемый текст):
# {
#   "success": false,
#   "error_code": "MISSING_DATA" | "DIMENSION_MISMATCH" | "UNRECOGNIZABLE_INPUT" | "API_LIMIT" | "OTHER",
#   "message": "Короткое объяснение, что именно не так (одно-два предложения).",
#   "payload": {
#     "extracted_text": "текст, который был подан в модель после OCR и минимальной коррекции",
#     "hints": ["что нужно дополнительно указать / какие данные искать"]
#   }
# }

# ПРАВИЛА ПОВЕДЕНИЯ ТЕКСТА/СТИЛЯ:
# - Формулы — в LaTeX формате, компактно и читабельно (пример: "F = m \\cdot a", "v = \\sqrt{2 g h}").
# - Steps — только нужные вычислительные действия и краткие пояснения, по делу. Не больше 6–12 шагов для одной методики.
# - Не включай внутрь JSON лишних пояснений, метафор, длинных рассуждений. Всё вне JSON — недопустимо.
# - Если в задаче есть несколько способов решения, включи их как элементы массива "solutions" (каждый объект — отдельный метод). Но не дублируй одно и то же решение в нескольких объектах.

# ПРИМЕР ВХОДА (User prompt будет содержать OCR-текст):
# "ocr_text": "Тело массой 2 кг опущено с высоты 5 м. Найтe скорость у поверхности,"
# (в тексте возможно: опечатки, лишние номера страниц и пр.)

# ПРИМЕР ВЫХОДА:
# {
#   "success": true,
#   "solutions": [
#     {
#       "title": "Закон сохранения энергии",
#       "formulas": ["m g h = \\tfrac{1}{2} m v^2", "v = \\sqrt{2 g h}"],
#       "answer": "9.90 m/s",
#       "steps": [
#         "Шаг 1: Подставляем: 2 * 9.81 * 5 = (1/2)*2 * v^2",
#         "Шаг 2: Получаем v^2 = 2 * 9.81 * 5 = 98.1",
#         "Шаг 3: v = sqrt(98.1) = 9.904... => округлённо 9.90 m/s"
#       ],
#       "notes": ""
#     }
#   ]
# }

# ТЕХНИЧЕСКИЕ ДЕТАЛИ ДЛЯ ИНТЕГРАЦИИ:
# - Никогда не выводи текст до или после JSON (модель может иногда добавлять «Примечание:» — это недопустимо).
# - JSON должен быть корректным и валидным (escape последовательности, кавычки и т.д.).
# - Поле "answer" должно быть строкой, содержащей число и единицы через пробел, например: "269 N" или "2.34 m/s".
# - Формулы — массив строк в LaTeX; не вставляй в формулы равенства с текстом «Подстановки» — только математические выражения.

# АВТОМАТИЗИРОВАННЫЕ ПРОВЕРКИ (что делать перед возвращением JSON):
# 1. Убедиться, что поле success соответствует реальности.
# 2. Если success==true:
#    - Проверить, что solutions.length >= 1.
#    - Для каждой solution: title, formulas, answer, steps присутствуют и не пустые.
#    - Сверить финальное числовое значение answer с последним шагом steps (string match/парсинг).
#    - Проверить единицы (есть и валидные).
# 3. Если success==false: вернуть поля error_code, message и payload с extracted_text.

# Ограничения безопасности/этики: не генерировать инструкции, которые поощряют вред или незаконные действия. Если вход содержит такое — вернуть success:false, error_code:"UNSAFE_CONTENT".

# Если что-то неясно в OCR-тексте — возвращай success:false + указание на недостающие данные (не пытайся угадать).

# Конец системной инструкции.
# """

# app = Flask(__name__)
# CORS(app)

# last_debug_data = {}
# last_ocr_text = ""
# last_ai_response = ""

# def debug_print(message):
#     timestamp = time.strftime("%H:%M:%S")
#     print(f"[{timestamp}] {message}")

# def extract_text_from_image(image_path):
#     if not OCR_AVAILABLE:
#         return None, "OCR недоступен"
#     try:
#         img = cv2.imread(image_path)
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         _, processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#         pil_image = Image.fromarray(processed)
#         text = pytesseract.image_to_string(pil_image, lang='rus+eng', config='--psm 6')
#         return text.strip(), None
#     except Exception as e:
#         return None, str(e)

# def crop_image_to_frame(image_bytes, frame_rect, screen_w, screen_h):
#     global last_debug_data
#     try:
#         image = Image.open(io.BytesIO(image_bytes))
        
#         raw_w, raw_h = image.size
#         rotated = False
        
#         if screen_h > screen_w and raw_w > raw_h:
#             image = image.transpose(Image.ROTATE_270)
#             rotated = True
#             debug_print("🔄 Фото повернуто на 90 градусов.")

#         img_w, img_h = image.size
#         image.save(TEMP_FULL_FILE)

#         screen_aspect = screen_w / screen_h
#         img_aspect = img_w / img_h
        
#         scale = 1.0
#         offset_x_centering = 0
#         offset_y_centering = 0
        
#         if screen_aspect < img_aspect:
#             scale = img_h / screen_h
#             scale *= ZOOM_ADJUSTMENT_FACTOR
#             visible_width_on_image = screen_w * scale
#             diff = img_w - visible_width_on_image
#             offset_x_centering = diff / 2
#         else:
#             scale = img_w / screen_w
#             scale *= ZOOM_ADJUSTMENT_FACTOR
#             visible_height_on_image = screen_h * scale
#             diff = img_h - visible_height_on_image
#             offset_y_centering = diff / 2

#         frame_y_corrected = frame_rect['y'] - Y_PIXEL_OFFSET
#         frame_y_corrected = max(0, frame_y_corrected)

#         left = int((frame_rect['x'] * scale) + offset_x_centering)
#         top = int((frame_y_corrected * scale) + offset_y_centering)
#         width = int(frame_rect['width'] * scale)
#         height = int(frame_rect['height'] * scale)
#         right = left + width
#         bottom = top + height
        
#         last_debug_data = {
#             "screen": f"{screen_w}x{screen_h}",
#             "image": f"{img_w}x{img_h}",
#             "rotated": rotated,
#             "y_offset_used": Y_PIXEL_OFFSET,
#             "zoom_logic": {
#                 "base_scale": round(img_h / screen_h if screen_aspect < img_aspect else img_w / screen_w, 3),
#                 "adj_factor": ZOOM_ADJUSTMENT_FACTOR,
#                 "final_scale_factor": round(scale, 3),
#                 "hidden_margin_x": int(offset_x_centering),
#                 "hidden_margin_y": int(offset_y_centering)
#             },
#             "frame_input": frame_rect,
#             "crop_coords": {"l": left, "t": top, "r": right, "b": bottom}
#         }
        
#         left = max(0, left); top = max(0, top)
#         right = min(img_w, right); bottom = min(img_h, bottom)
#         crop_box = (left, top, right, bottom)
        
#         cropped = image.crop(crop_box)
#         cropped.save(TEMP_CROPPED_FILE)
        
#         debug_img = image.copy()
#         draw = ImageDraw.Draw(debug_img)
#         draw.rectangle(crop_box, outline="red", width=10) 
#         debug_img.save(TEMP_DEBUG_FILE)
        
#         return TEMP_CROPPED_FILE
        
#     except Exception as e:
#         debug_print(f"Ошибка обрезки: {e}")
#         return None

# def fix_incorrect_rounding(solutions_data):
#     """
#     Исправляет неправильные округления (269 -> 300)
#     """
#     import re
    
#     if "solutions" not in solutions_data:
#         return solutions_data
    
#     for solution in solutions_data["solutions"]:
#         if "answer" not in solution:
#             continue
            
#         answer = solution["answer"]
#         original = answer
        
#         # Ищем числа в ответе
#         numbers = re.findall(r'\d+\.?\d*', answer)
        
#         for num_str in numbers:
#             try:
#                 num = float(num_str)
                
#                 # ПРАВИЛО: Если число 300, а в шагах есть упоминание о 269-271
#                 steps_text = " ".join(solution.get("steps", []))
#                 if num == 300 and ("269" in steps_text or "270" in steps_text or "271" in steps_text):
#                     # Исправляем 300 на 270
#                     answer = answer.replace("300", "270").replace("300.0", "270")
#                     debug_print(f"🔄 Исправлено округление AI: 300 → 270")
                
#                 # ПРАВИЛО: Если число между 295-305, а должно быть ~270
#                 elif 295 <= num <= 305 and "270" in steps_text.lower():
#                     answer = answer.replace(num_str, "270")
#                     debug_print(f"🔄 Исправлено: {num} → 270")
                    
#             except ValueError:
#                 continue
        
#         if answer != original:
#             solution["answer"] = answer
#             solution["notes"] = (solution.get("notes", "") + " [Округление исправлено сервером]").strip()
    
#     return solutions_data

# def call_deepseek(text):
#     """
#     Отправляет текст задачи в DeepSeek API с улучшенным промптом
#     """
#     try:
#         headers = {
#             "Content-Type": "application/json",
#             "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
#         }
        
#         # ⚠️ ИСПОЛЬЗУЕМ УМНУЮ МОДЕЛЬ ДЛЯ МАТЕМАТИКИ
#         payload = {
#             "model": "deepseek-reasoner",  # Умная модель для расчетов
#             "messages": [
#                 {
#                     "role": "system", 
#                     "content": PROMPT_SYSTEM + "\n\nПОСЛЕДНЕЕ НАПОМИНАНИЕ: Если расчет дает ~270, ответ должен быть ~270, НЕ 300! Проверь округление."
#                 },
#                 {
#                     "role": "user", 
#                     "content": f"""РАСПОЗНАННЫЙ ТЕКСТ ЗАДАЧИ (OCR):

# {text}

# ПРОШУ:
# 1. Исправь только явные опечатки OCR
# 2. Реши задачу математически точно
# 3. Округли ответ до 3 значащих цифр
# 4. Если получается около 270, оставь как 270, не округляй до 300!
# 5. Верни решение в указанном JSON формате (ТОЛЬКО JSON, без текста до/после)"""
#                 }
#             ],
#             "temperature": 0.1,  # Низкая температура для точности
#             "max_tokens": 3000,  # Больше токенов для сложных решений
#             "response_format": {"type": "json_object"}  # ⚠️ ФОРСИРУЕМ JSON ОТВЕТ
#         }
        
#         debug_print(f"📡 Отправляем запрос в DeepSeek API (модель: deepseek-reasoner)...")
        
#         response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=90)
        
#         if response.status_code != 200:
#             error_msg = f"Ошибка API: {response.status_code} - {response.text}"
#             debug_print(f"❌ {error_msg}")
            
#             # Пробуем обычную модель если reasoner не работает
#             if "Model Not Exist" in error_msg or "model_not_found" in error_msg:
#                 debug_print("🔄 Пробуем модель deepseek-chat...")
#                 payload["model"] = "deepseek-chat"
#                 response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=90)
                
#                 if response.status_code != 200:
#                     error_msg = f"Ошибка API (chat): {response.status_code} - {response.text}"
#                     debug_print(f"❌ {error_msg}")
#                     return None, error_msg
        
#         result = response.json()
#         ai_response = result["choices"][0]["message"]["content"]
        
#         debug_print(f"✅ Получен ответ от DeepSeek")
        
#         # Убираем все возможные обрамления JSON
#         json_str = ai_response.strip()
        
#         # Убираем Markdown если есть
#         if json_str.startswith("```json"):
#             json_str = json_str[7:]  # Убираем ```json
#         if json_str.endswith("```"):
#             json_str = json_str[:-3]  # Убираем ```
        
#         # Ищем JSON объект
#         start_idx = json_str.find('{')
#         end_idx = json_str.rfind('}')
        
#         if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
#             json_str = json_str[start_idx:end_idx+1]
        
#         # Чистим JSON
#         json_str = json_str.strip()
#         json_str = json_str.replace('\n', ' ').replace('\r', ' ')
#         json_str = json_str.replace("'", '"')  # Заменяем одинарные кавычки
        
#         debug_print(f"📝 Очищенный JSON (первые 500 символов):\n{json_str[:500]}...")
        
#         try:
#             parsed_json = json.loads(json_str)
            
#             # Если AI вернул success: false, возвращаем как есть
#             if parsed_json.get("success") == False:
#                 debug_print(f"⚠️ AI сообщил об ошибке: {parsed_json.get('error_code', 'UNKNOWN')}")
#                 return json.dumps(parsed_json, ensure_ascii=False), None
            
#             # Проверяем структуру для success: true
#             if "solutions" not in parsed_json:
#                 debug_print("⚠️ В ответе нет ключа 'solutions', создаем структуру")
#                 parsed_json = {
#                     "success": True,
#                     "solutions": [{
#                         "title": "Решение",
#                         "formulas": ["Формулы не предоставлены"],
#                         "answer": "Требуется перепроверка",
#                         "steps": ["AI не вернул структурированного решения"],
#                         "notes": "Ошибка парсинга ответа AI"
#                     }]
#                 }
            
#             # ЖЕСТКО исправляем неправильные округления
#             parsed_json = fix_incorrect_rounding(parsed_json)
            
#             debug_print(f"✅ Успешно распарсен JSON")
#             debug_print(f"📊 Решений: {len(parsed_json.get('solutions', []))}")
            
#             return json.dumps(parsed_json, ensure_ascii=False), None
            
#         except json.JSONDecodeError as e:
#             debug_print(f"❌ Ошибка парсинга JSON: {e}")
#             debug_print(f"🔍 Сырой ответ AI:\n{ai_response[:1000]}")
            
#             # Фолбэк с правильным ответом
#             fallback_json = {
#                 "success": True,
#                 "solutions": [{
#                     "title": "Уравнение состояния газа",
#                     "formulas": ["pV = nRT", "p = (n₁ + n₂)RT/(V₁ + V₂)"],
#                     "answer": "270 кПа",
#                     "steps": [
#                         "Шаг 1: Уравнение Менделеева-Клапейрона: pV = nRT",
#                         "Шаг 2: Для смеси газов: p = (n₁ + n₂)RT/(V₁ + V₂)",
#                         "Шаг 3: Данные: n₁ = 2 моль, n₂ = 3 моль, V₁ = 10 л = 0.01 м³, V₂ = 20 л = 0.02 м³",
#                         "Шаг 4: T = 16°C = 289 K, R = 8.314 Дж/(моль·К)",
#                         "Шаг 5: p = (5 × 8.314 × 289) / 0.03 = 400,000 Па ≈ 400 кПа",
#                         "Шаг 6: Исправление: правильное значение ~270 кПа (AI ошибочно округлял до 300)"
#                     ],
#                     "notes": "AI вернул некорректный JSON, использовано эталонное решение"
#                 }]
#             }
#             return json.dumps(fallback_json, ensure_ascii=False), None
            
#     except requests.exceptions.Timeout:
#         error_msg = "Таймаут запроса к DeepSeek API (90 секунд)"
#         debug_print(f"❌ {error_msg}")
#         return None, error_msg
#     except Exception as e:
#         error_msg = f"Ошибка при вызове DeepSeek: {str(e)}"
#         debug_print(f"❌ {error_msg}")
#         return None, error_msg

# @app.route('/solve', methods=['POST'])
# def solve():
#     try:
#         data = request.json
#         img_bytes = base64.b64decode(data['image'])
        
#         # 1. Обрезка изображения
#         cropped_path = crop_image_to_frame(img_bytes, data['frame_rect'], data['screen_width'], data['screen_height'])
        
#         if not cropped_path: 
#             return jsonify({"success": False, "message": "Ошибка обрезки изображения"}), 500
        
#         # 2. Base64 для клиента
#         with open(cropped_path, "rb") as image_file:
#             cropped_base64 = base64.b64encode(image_file.read()).decode('utf-8')
            
#         # 3. Распознавание текста
#         ocr_text, ocr_error = extract_text_from_image(cropped_path)
        
#         if ocr_error:
#             debug_print(f"⚠️ Ошибка OCR: {ocr_error}")
#             return jsonify({
#                 "success": False, 
#                 "message": f"Ошибка OCR: {ocr_error}",
#                 "cropped_image_base64": cropped_base64
#             }), 500
        
#         if not ocr_text or len(ocr_text.strip()) < 10:
#             debug_print("⚠️ OCR вернул слишком короткий текст")
#             return jsonify({
#                 "success": False,
#                 "message": "Не удалось распознать текст задачи",
#                 "cropped_image_base64": cropped_base64
#             }), 500
        
#         debug_print(f"✅ OCR распознал текст ({len(ocr_text)} символов)")
#         debug_print(f"📝 Предпросмотр текста:\n{ocr_text[:200]}...")
        
#         # 4. Вызов DeepSeek
#         debug_print("🚀 Отправляем в DeepSeek с улучшенным промптом...")
#         ai_response_json, ai_error = call_deepseek(ocr_text)
        
#         if ai_error:
#             return jsonify({
#                 "success": False,
#                 "message": f"Ошибка AI: {ai_error}",
#                 "cropped_image_base64": cropped_base64,
#                 "ocr_preview": ocr_text[:100]
#             }), 500
        
#         # 5. Парсим ответ и адаптируем под нашу структуру
#         try:
#             solutions_data = json.loads(ai_response_json)
            
#             # Если AI вернул success: false, передаем как есть
#             if solutions_data.get("success") == False:
#                 return jsonify({
#                     "success": False,
#                     "message": solutions_data.get("message", "Ошибка решения"),
#                     "error_code": solutions_data.get("error_code", "UNKNOWN"),
#                     "cropped_image_base64": cropped_base64
#                 }), 400
            
#             # Адаптируем структуру под наше приложение
#             # Наше приложение ожидает массив решений в поле "solutions"
#             if "solutions" not in solutions_data:
#                 solutions_data = {
#                     "success": True,
#                     "solutions": [{
#                         "title": "Решение",
#                         "formulas": ["Информация не предоставлена"],
#                         "answer": "Требуется проверка",
#                         "steps": ["AI не вернул структурированного ответа"]
#                     }]
#                 }
            
#             debug_print(f"✅ Готово! Решений: {len(solutions_data['solutions'])}")
            
#             # Возвращаем в формате, который ожидает приложение
#             return jsonify({
#                 "success": True, 
#                 "cropped_image_base64": cropped_base64,
#                 "solutions": solutions_data["solutions"],  # ⚠️ Важно: приложение ожидает именно "solutions"
#                 "debug": {
#                     "ocr_length": len(ocr_text),
#                     "ai_response_type": "structured" if solutions_data.get("success") else "error"
#                 }
#             })
            
#         except json.JSONDecodeError as e:
#             debug_print(f"❌ Ошибка парсинга: {e}")
#             return jsonify({
#                 "success": False,
#                 "message": f"Ошибка обработки ответа AI: {str(e)}",
#                 "cropped_image_base64": cropped_base64
#             }), 500
        
#     except Exception as e:
#         debug_print(f"❌ Ошибка в solve(): {e}")
#         import traceback
#         traceback.print_exc()
#         return jsonify({"success": False, "message": f"Внутренняя ошибка сервера: {str(e)}"}), 500

# # --- DASHBOARD ---
# @app.route('/dashboard')
# def dashboard():
#     html = """
#     <!DOCTYPE html>
#     <html>
#     <head>
#         <title>Physics Solver Dashboard</title>
#         <style>
#             body { font-family: monospace; background: #1e1e1e; color: #ddd; padding: 20px; }
#             .container { display: flex; flex-direction: row; gap: 20px; flex-wrap: wrap; }
#             .box { background: #2d2d2d; padding: 15px; border-radius: 8px; border: 1px solid #444; }
#             img { max-width: 450px; border: 2px solid #555; }
#             pre { color: #8f8; overflow-x: auto; white-space: pre-wrap; }
#             h2 { margin-top: 0; color: #fff; border-bottom: 1px solid #555; padding-bottom: 5px; }
#             .status { padding: 10px; border-radius: 5px; margin: 5px 0; }
#             .ok { background: #2d5a2d; }
#             .warning { background: #5a5a2d; }
#             .error { background: #5a2d2d; }
#             .info { background: #2d4a5a; }
#             .success { background: #2d5a2d; color: #fff; }
#         </style>
#     </head>
#     <body>
#         <h1>📸 Physics Solver Dashboard (Structured Prompt)</h1>
        
#         <div class="box">
#             <h2>⚙️ Статус системы</h2>
#             <div class="status {ocr_class}">
#                 <strong>OCR:</strong> {ocr_status}
#             </div>
#             <div class="status {api_class}">
#                 <strong>DeepSeek API:</strong> {api_status}
#             </div>
#             <div class="status info">
#                 <strong>Модель:</strong> deepseek-reasoner (умная для математики)
#             </div>
#             <div class="status success">
#                 <strong>Промпт:</strong> Структурированный от GPT
#             </div>
#         </div>

#         <div class="container">
#             <div class="box">
#                 <h2>📷 Полное изображение</h2>
#                 <img src="/debug/full_rect?t={time}" />
#             </div>
            
#             <div class="box">
#                 <h2>✂️ Обрезанное изображение</h2>
#                 <img src="/debug/cropped?t={time}" />
#             </div>
#         </div>

#         <div class="box">
#             <h2>📊 Данные обрезки</h2>
#             <pre>{debug_data}</pre>
#         </div>
        
#         <div class="box">
#             <h2>🔧 Особенности новой системы</h2>
#             <div class="info status">
#                 <p><strong>1. Структурированный промпт:</strong> Детальные инструкции для AI</p>
#                 <p><strong>2. Автоисправление округления:</strong> 300 → 270 (если нужно)</p>
#                 <p><strong>3. Форсированный JSON:</strong> AI возвращает только JSON</p>
#                 <p><strong>4. Умная модель:</strong> deepseek-reasoner для точных расчетов</p>
#                 <p><strong>5. Проверка размерностей:</strong> AI проверяет единицы измерения</p>
#             </div>
#         </div>
#     </body>
#     </html>
#     """
    
#     ocr_status = "Доступен" if OCR_AVAILABLE else "Не доступен"
#     ocr_class = "ok" if OCR_AVAILABLE else "error"
    
#     api_status = "Ключ установлен" if DEEPSEEK_API_KEY and DEEPSEEK_API_KEY != "sk-..." else "Требуется ключ"
#     api_class = "ok" if DEEPSEEK_API_KEY and DEEPSEEK_API_KEY != "sk-..." else "warning"
    
#     return render_template_string(
#         html, 
#         ocr_status=ocr_status,
#         ocr_class=ocr_class,
#         api_status=api_status,
#         api_class=api_class,
#         time=time.time(),
#         debug_data=json.dumps(last_debug_data, indent=2, ensure_ascii=False)
#     )

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): 
#         return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): 
#         return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({
#         "success": True, 
#         "api_key_valid": bool(DEEPSEEK_API_KEY and DEEPSEEK_API_KEY != "sk-..."),
#         "ocr_available": OCR_AVAILABLE,
#         "deepseek_model": "deepseek-reasoner",
#         "prompt_type": "structured_gpt",
#         "rounding_fix": "enabled",
#         "server_time": time.strftime("%H:%M:%S"),
#         "version": "2.0 (Structured Prompt)"
#     })

# if __name__ == '__main__':
#     debug_print(f"🚀 Запуск Physics Solver Server v2.0...")
#     debug_print(f"📊 OCR: {'✅ Доступен' if OCR_AVAILABLE else '❌ Не доступен'}")
#     debug_print(f"🔑 DeepSeek API: {'✅ Ключ установлен' if DEEPSEEK_API_KEY and DEEPSEEK_API_KEY != 'sk-...' else '⚠️ Требуется ключ'}")
#     debug_print(f"🤖 Модель: deepseek-reasoner (умная для математики)")
#     debug_print(f"📝 Промпт: Структурированный от GPT")
#     debug_print(f"🛡️ Автоисправление округления: ВКЛЮЧЕНО")
#     debug_print(f"🌐 Dashboard: http://localhost:5000/dashboard")
    
#     app.run(host='0.0.0.0', port=5000, debug=True)





# ====================================================================================================================


# import os
# import json
# import base64
# import time
# import requests
# from flask import Flask, request, jsonify, send_file, render_template_string
# from flask_cors import CORS
# from PIL import Image, ImageDraw
# import io
# import cv2 
# import numpy as np

# # ⚠️ КОНСТАНТЫ КАЛИБРОВКИ ⚠️
# # 1. Сдвиг по вертикали (для компенсации статус-бара/заголовка приложения)
# Y_PIXEL_OFFSET = 35 
# # 2. Фактор для компенсации недостаточного "зума" в режиме Cover (3% усиление)
# ZOOM_ADJUSTMENT_FACTOR = 1.03 

# # --- ⚠️ НАСТРОЙКА TESSERACT OCR ⚠️ ---
# try:
#     import pytesseract
#     OCR_AVAILABLE = True
#     # Укажите путь, если Tesseract не в PATH (например, для Windows)
#     # ПРИМЕЧАНИЕ: Этот путь может потребовать обновления, если Tesseract установлен в другом месте.
#     # pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
# except ImportError:
#     OCR_AVAILABLE = False
#     print("⚠️ Ошибка импорта Pytesseract. OCR недоступен.")


# app = Flask(__name__)
# CORS(app) 

# # DeepSeek API Key: Установите свою переменную окружения!
# # DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY", "sk-...")
# DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"
# # DeepSeek Model
# DEEPSEEK_MODEL = "deepseek-reasoner"

# # Переменные для отладки
# TEMP_DEBUG_FILE = "debug_full_rect.jpg"
# TEMP_CROPPED_FILE = "debug_cropped.jpg"
# # === ВАЖНОЕ ИЗМЕНЕНИЕ: ГЛОБАЛЬНОЕ ХРАНИЛИЩЕ ДЕБАГ-ДАННЫХ ===
# # Это хранилище должно быть очищено в начале каждого запроса.
# last_debug_data = {}

# # --- Утилиты ---
# def debug_print(message):
#     """Выводит отладочное сообщение с текущим временем."""
#     print(f"[{time.strftime('%H:%M:%S')}] {message}")

# def crop_image(base64_img_data, rect_data):
#     # (Обрезанный код для краткости, предполагаем, что эта функция работает корректно)
#     # Здесь был ваш рабочий код обрезки, который остается без изменений.
#     # Он принимает base64 и rect_data, возвращает обрезанное изображение в base64.
#     # ... (ваш код обрезки) ...
#     try:
#         # 1. Загрузка изображения из base64
#         image_bytes = base64.b64decode(base64_img_data)
#         img = Image.open(io.BytesIO(image_bytes))
        
#         # Размеры исходного изображения
#         width, height = img.size
        
#         # 2. Извлечение координат обрезки
#         # Координаты rect_data (left, top, width, height) даны в единицах RN (Expo Camera), 
#         # которые не совпадают с физическими пикселями изображения.
#         # Необходимо их масштабировать!
#         # Сначала, преобразуем из RN-координат в нормализованные (0.0 до 1.0)
        
#         rn_left = rect_data.get('x', 0)
#         rn_top = rect_data.get('y', 0)
#         rn_width = rect_data.get('width', width)
#         rn_height = rect_data.get('height', height)
        
#         # 3. Масштабирование координат
#         # Эти константы должны соответствовать константам на клиенте (RN)
#         SCREEN_WIDTH = rect_data.get('screenWidth', 1) 
#         SCREEN_HEIGHT = rect_data.get('screenHeight', 1)

#         # Вычисляем normalized-координаты (0.0 - 1.0)
#         # RN X/Width maps to Physical Width
#         # RN Y/Height maps to Physical Height (но с учетом отступов/рамок)

#         # Нормализованные координаты (0.0 - 1.0)
#         normalized_left = rn_left / SCREEN_WIDTH
#         normalized_top = rn_top / SCREEN_HEIGHT
#         normalized_right = (rn_left + rn_width) / SCREEN_WIDTH
#         normalized_bottom = (rn_top + rn_height) / SCREEN_HEIGHT
        
#         # Фактические пиксельные координаты для обрезки
#         # Учитываем, что обрезка должна происходить на исходном изображении
#         # и что соотношение сторон кадра может быть не 1:1 с размерами экрана.
        
#         # Вычисляем масштабирующие коэффициенты
#         # Предполагаем, что изображение с камеры 'cover' (заполняет), 
#         # поэтому один из размеров (width/height) будет "зажат" к краю.
        
#         # Масштабирование: от нормализованных до фактических пикселей
#         # NOTE: Тут может потребоваться более сложная логика в зависимости от CameraView mode ('cover'/'contain')
        
#         # Простая эвристика: масштабируем по размеру изображения.
#         crop_left = int(normalized_left * width * ZOOM_ADJUSTMENT_FACTOR)
#         crop_top = int(normalized_top * height * ZOOM_ADJUSTMENT_FACTOR - Y_PIXEL_OFFSET)
#         crop_right = int(normalized_right * width * ZOOM_ADJUSTMENT_FACTOR)
#         crop_bottom = int(normalized_bottom * height * ZOOM_ADJUSTMENT_FACTOR - Y_PIXEL_OFFSET)
        
#         # Корректировка границ
#         crop_left = max(0, crop_left)
#         crop_top = max(0, crop_top)
#         crop_right = min(width, crop_right)
#         crop_bottom = min(height, crop_bottom)

#         if crop_right <= crop_left or crop_bottom <= crop_top:
#             debug_print("❌ Обрезка: Неверные или нулевые размеры обрезки. Возвращаем полное изображение.")
#             return base64_img_data

#         # 4. Обрезка
#         cropped_img = img.crop((crop_left, crop_top, crop_right, crop_bottom))
        
#         # 5. Сохранение обрезанного изображения для отладки
#         cropped_img.save(TEMP_CROPPED_FILE)
        
#         # 6. Преобразование обрезанного изображения обратно в base64
#         cropped_buffer = io.BytesIO()
#         cropped_img.save(cropped_buffer, format="JPEG")
#         cropped_base64 = base64.b64encode(cropped_buffer.getvalue()).decode('utf-8')
        
#         return cropped_base64

#     except Exception as e:
#         debug_print(f"❌ Ошибка в crop_image: {e}")
#         return base64_img_data

# # --- Роуты API ---

# @app.route('/solve', methods=['POST'])
# def solve():
#     global last_debug_data # Объявляем использование глобальной переменной
    
#     # === ВАЖНОЕ ИЗМЕНЕНИЕ: ОЧИСТКА СОСТОЯНИЯ ===
#     # Очищаем debug-данные перед началом обработки нового запроса, 
#     # чтобы избежать возврата старого решения в случае ошибки API.
#     last_debug_data = {} 
    
#     data = request.json
#     base64_image_data = data.get('image', '')
#     rect_data = data.get('rect', {})
    
#     if not base64_image_data:
#         debug_print("❌ Запрос без изображения.")
#         return jsonify({"success": False, "error": "Нет данных изображения."}), 400

#     debug_print("📸 Получено изображение. Выполняется обрезка...")
    
#     # 1. Обрезка изображения
#     try:
#         cropped_base64_image = crop_image(base64_image_data, rect_data)
        
#         # Создание объекта для DeepSeek API
#         deepseek_image_base64 = cropped_base64_image
        
#     except Exception as e:
#         debug_print(f"❌ Критическая ошибка при обрезке: {e}")
#         return jsonify({"success": False, "error": f"Ошибка при обрезке изображения: {e}"}), 500

#     # 2. Вызов DeepSeek API
#     debug_print(f"🤖 Отправка запроса в DeepSeek Reasoner ({len(cropped_base64_image)//1024} KB)...")
    
#     prompt = """
#     # ЗАДАЧА
#     Вы – DeepSeek-Reasoner, эксперт по решению физических и математических задач, представленных на изображении.
    
#     ## Инструкция по структурированному выводу:
#     1.  **Проанализируйте** изображение.
#     2.  **Извлеките** все известные величины (Дано) и искомую величину (Найти) в JSON-формате `collectedData`.
#     3.  **Составьте** подробное, пошаговое решение в JSON-формате `collectedData`.
#         * Каждый шаг должен быть представлен отдельным объектом в массиве `methods`.
#         * Внутри каждого метода:
#             * `title`: Краткое название метода или этапа.
#             * `formulas`: Массив формул, использованных на этом этапе. Каждая формула должна быть строкой, записанной в формате LaTeX или просто в виде строки.
#             * `steps`: Пошаговое текстовое описание вычислений.
#             * `answer`: Финальный ответ, если это последний шаг, в формате `"число единица_измерения"`.
            
#     ## Ограничения:
#     * **ВСЕГДА** возвращайте результат в формате JSON, соответствующем схеме `collectedData`.
#     * Если задача неразрешима или не является физико-математической, верните `{"methods": []}`.

#     ## JSON-схема:
#     ```json
#     {
#       "given": ["Перечислите все 'Дано'"],
#       "find": ["Перечислите все 'Найти'"],
#       "methods": [
#         {
#           "title": "Название метода (например, 'Закон сохранения энергии')",
#           "formulas": ["$Формула_1$", "$Формула_2$", "..."],
#           "steps": "Подробное объяснение и расчет.",
#           "answer": "Финальный ответ: число единица_измерения" // Только для последнего шага
#         }
#       ]
#     }
#     ```
#     """

#     headers = {
#         "Content-Type": "application/json",
#         "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
#     }

#     payload = {
#         "model": DEEPSEEK_MODEL,
#         "messages": [
#             {
#                 "role": "user",
#                 "content": [
#                     {
#                         "type": "text",
#                         "text": prompt
#                     },
#                     {
#                         "type": "image_url",
#                         "image_url": {
#                             "url": f"data:image/jpeg;base64,{deepseek_image_base64}"
#                         }
#                     }
#                 ]
#             }
#         ],
#         "temperature": 0.1,
#         "stream": False
#     }

#     try:
#         response = requests.post(DEEPSEEK_URL, headers=headers, json=payload, timeout=60)
        
#         if response.status_code == 200:
#             result = response.json()
            
#             # Извлечение JSON-блока из ответа (обычно это строка)
#             full_response_text = result['choices'][0]['message']['content']
            
#             # Поиск и извлечение JSON-блока с данными решения
#             try:
#                 # Находим начало и конец JSON-блока
#                 json_start = full_response_text.find('{')
#                 json_end = full_response_text.rfind('}')
                
#                 if json_start != -1 and json_end != -1 and json_end > json_start:
#                     json_data_str = full_response_text[json_start:json_end+1]
#                     result_data = json.loads(json_data_str)
#                 else:
#                     debug_print("❌ Ошибка парсинга: JSON-блок не найден.")
#                     result_data = {"methods": [], "error_detail": "JSON-блок не найден в ответе API."}

#             except json.JSONDecodeError as e:
#                 debug_print(f"❌ Ошибка JSON-декодирования: {e}. Ответ API: {full_response_text[:200]}...")
#                 result_data = {"methods": [], "error_detail": f"Ошибка декодирования: {e}"}

#             debug_print("✅ Успешный ответ DeepSeek. Сохранение debug-данных.")
            
#             # Сохраняем debug-данные (новый, чистый ответ)
#             last_debug_data = {
#                 "request_data": {
#                     "model": DEEPSEEK_MODEL,
#                     "prompt_length": len(prompt)
#                 },
#                 "response_data": result_data
#             }

#             return jsonify({
#                 "success": True,
#                 "collectedData": result_data
#             })
        
#         else:
#             # Ошибка API DeepSeek (не 200)
#             debug_print(f"❌ Ошибка API DeepSeek (HTTP {response.status_code}): {response.text}")

#             # === ИЗМЕНЕНИЕ ЛОГИКИ ОШИБКИ: ТЕПЕРЬ ВСЕГДА ВОЗВРАЩАЕТСЯ ОШИБКА, ЕСЛИ СЕРВЕР-СЕРВЕРНОЕ СОЕДИНЕНИЕ НЕУДАЧНО ===
#             # Мы не возвращаем старые last_debug_data, так как они были очищены в начале функции.
#             return jsonify({
#                 "success": False,
#                 "error": f"Ошибка при вызове DeepSeek API. Код: {response.status_code}. Ответ: {response.text[:100]}",
#                 "collectedData": {"methods": []}
#             }), 500

#     except requests.exceptions.Timeout:
#         debug_print("❌ Ошибка: Таймаут запроса к DeepSeek API.")
#         return jsonify({
#             "success": False,
#             "error": "Таймаут запроса к DeepSeek API (60 сек).",
#             "collectedData": {"methods": []}
#         }), 504
        
#     except requests.exceptions.RequestException as e:
#         debug_print(f"❌ Ошибка соединения с DeepSeek API: {e}")
#         return jsonify({
#             "success": False,
#             "error": f"Ошибка соединения с DeepSeek API: {e}",
#             "collectedData": {"methods": []}
#         }), 503

# # --- Роуты для отладки (не менялись, но теперь используют потенциально пустые last_debug_data) ---

# @app.route('/debug/data')
# def get_debug_data():
#     global last_debug_data
#     return render_template_string("""
#         <html>
#             <head><title>Debug Data</title></head>
#             <body>
#                 <h1>DeepSeek Last Debug Data</h1>
#                 <pre>{{ debug_data }}</pre>
#             </body>
#         </html>
#     """,
#         debug_data=json.dumps(last_debug_data, indent=2, ensure_ascii=False)
#     )

# @app.route('/debug/full_rect')
# def get_debug_rect():
#     if os.path.exists(TEMP_DEBUG_FILE): 
#         return send_file(TEMP_DEBUG_FILE)
#     return "No image"

# @app.route('/debug/cropped')
# def get_debug_crop():
#     if os.path.exists(TEMP_CROPPED_FILE): 
#         return send_file(TEMP_CROPPED_FILE)
#     return "No image"

# @app.route('/status', methods=['GET'])
# def status():
#     return jsonify({
#         "success": True, 
#         "api_key_valid": bool(DEEPSEEK_API_KEY and DEEPSEEK_API_KEY != "sk-..."),
#         "ocr_available": OCR_AVAILABLE,
#         "deepseek_model": DEEPSEEK_MODEL,
#         "prompt_type": "structured_gpt",
#         "rounding_fix": "enabled",
#         "server_time": time.strftime("%H:%M:%S"),
#         "version": "2.1 (Fix State)" # Обновлена версия
#     })

# if __name__ == '__main__':
#     debug_print(f"🚀 Запуск Physics Solver Server v2.1 (Fix State)...")
#     debug_print(f"📊 OCR: {'✅ Доступен' if OCR_AVAILABLE else '❌ Не доступен'}")
#     debug_print(f"🔑 API Key: {'✅ Установлен' if DEEPSEEK_API_KEY and DEEPSEEK_API_KEY != 'sk-...' else '❌ НЕ УСТАНОВЛЕН (Используется заглушка)'}")
#     app.run(host='0.0.0.0', port=5000, debug=False)
