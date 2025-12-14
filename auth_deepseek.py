import os
import time
from playwright.sync_api import sync_playwright

# Имя файла для сохранения сессии
AUTH_FILE = 'deepseek_auth.json' 
DEEPSEEK_URL = "https://chat.deepseek.com/chat" 

def run(p: sync_playwright):
    print("--- Запуск браузера Playwright для ручной авторизации ---")
    print("ВНИМАНИЕ: Необходимо вручную пройти Cloudflare Captcha и войти в аккаунт DeepSeek.")

    # Обязательно headless=False для видимого режима
    browser = p.chromium.launch(headless=False, slow_mo=500) 
    context = browser.new_context()
    page = context.new_page()
    
    page.goto(DEEPSEEK_URL, timeout=120000)

    # Даем вам 60 секунд на ручное взаимодействие
    print("\n*** У вас есть 60 секунд. Пожалуйста, пройдите Captcha и войдите в аккаунт! ***")
    
    # Ждем, пока пользователь войдет. 
    try:
        # Ждем, пока не появится основной интерфейс чата (элемент, который виден после входа)
        # Если вы входите, этот элемент появится, и скрипт сразу сохранит сессию.
        page.wait_for_selector('textarea[placeholder*="Ask DeepSeek"]', timeout=60000) 
        print("--- Успех! Обнаружено поле ввода чата. Сессия будет сохранена. ---")
    except Exception:
        print("--- Вход не обнаружен или время вышло. Сохраняем текущее состояние. ---")
    
    # Сохраняем состояние контекста (куки, которые обходят Cloudflare)
    context.storage_state(path=AUTH_FILE)
    print(f"\n✅ Сессия сохранена в файл: {AUTH_FILE}")
    
    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)