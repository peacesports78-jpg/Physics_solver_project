



//----------------------------------------------------------------3chat deepseek version


// // // // 111111111111111111111111111111111chat111111111111111111111111111111111chat111111111111111111111111111111111chat111111111111111111111111111111111chat
import React, { useRef, useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
    ScrollView,
    Animated,
    PanResponder,
    Image,
    Dimensions,
    Platform,
    Easing,
    ActivityIndicator
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const BOTTOM_PANEL_RATIO = 0.45;
const TOP_AVAILABLE_RATIO = 1 - BOTTOM_PANEL_RATIO;
const TOP_MARGIN = Platform.OS === "android" ? 24 : 34;
const MAX_FRAME_HEIGHT = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN - 8;

// Адрес твоего локального Python-сервера
const SERVER_URL = `http://192.168.0.10:5000/solve`;

// Интерфейсы для структуры данных
interface SolutionMethod {
    title: string;
    answer: string;
    formulas: string[];
    steps: string[];
}

export default function PhysicsSolver() {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const frameRef = useRef<View>(null); 

    const [isTakingPhoto, setIsTakingPhoto] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [showSolutions, setShowSolutions] = useState(false);
    const [isScrolledToTop, setIsScrolledToTop] = useState(true);
    
    // Состояние для хранения данных от сервера
    const [collectedData, setCollectedData] = useState<{ methods: SolutionMethod[] }>({ methods: [] });
    const [isProcessing, setIsProcessing] = useState(false);
    const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

    // НОВОЕ СОСТОЯНИЕ: Обрезанное изображение от сервера (то, что попало в красную рамку)
    const [croppedImageUri, setCroppedImageUri] = useState<string | null>(null);

    // Анимация виджетов (снизу вверх)
    const initialPanelTranslate = Math.floor(SCREEN_HEIGHT * BOTTOM_PANEL_RATIO);
    const slideAnim = useRef(new Animated.Value(initialPanelTranslate)).current;
    
    // Анимация рамки (от центра к верху)
    const moveFrameAnim = useRef(new Animated.Value(0)).current;

    // Храним координаты для анимации
    const [sourceRect, setSourceRect] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
    const [targetRect, setTargetRect] = useState<{ x: number, y: number } | null>(null);

    const [frameSize, setFrameSize] = useState({
        width: Math.min(300, SCREEN_WIDTH - 40),
        height: Math.min(200, MAX_FRAME_HEIGHT)
    });
    const initialFrameSize = useRef({ ...frameSize });

    // Проверка статуса сервера при загрузке
    useEffect(() => {
        checkServerStatus();
    }, []);

    const checkServerStatus = async () => {
        try {
            // Используем AbortController для таймаута (timeout не работает в React Native fetch)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const statusUrl = SERVER_URL.replace('/solve', '/status');
            console.log(`🔍 Проверяю сервер: ${statusUrl}`);
            
            const response = await fetch(statusUrl, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('📡 Ответ от /status:', result);
            
            if (result.success && result.api_key_valid) {
                setServerStatus('online');
                console.log('✅ Сервер работает, API ключ действителен');
            } else {
                setServerStatus('offline');
                console.log('❌ Сервер недоступен или API ключ недействителен');
            }
        } catch (error: any) {
            setServerStatus('offline');
            if (error.name === 'AbortError') {
                console.log('❌ Таймаут подключения к серверу (5 сек)');
            } else if (error.message?.includes('Network request failed')) {
                console.log('❌ Ошибка сети. Проверьте:\n1. Запущен ли server.py\n2. Правильный ли IP адрес (192.168.0.10)\n3. Оба устройства в одной сети Wi-Fi');
            } else {
                console.log('❌ Ошибка подключения:', error.message || error);
            }
        }
    };

    // ------------------- ЖЕСТЫ И РЕСАЙЗ -------------------
    const swipePanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx),
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) slideAnim.setValue(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > 80) {
                    handleCloseWithAlert();
                } else {
                    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
                }
            }
        })
    ).current;

    const MIN_SIZE = 100;
    const MAX_WIDTH = SCREEN_WIDTH - 40;
    const MAX_HEIGHT = MAX_FRAME_HEIGHT;

    const handleResizeStart = () => {
        initialFrameSize.current = { ...frameSize };
    };

    const topResizePanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
            onPanResponderGrant: handleResizeStart,
            onPanResponderMove: (_, g) => {
                const newHeight = Math.min(
                    MAX_HEIGHT,
                    Math.max(MIN_SIZE, initialFrameSize.current.height - g.dy * 2)
                );
                setFrameSize((p) => ({ ...p, height: newHeight }));
            }
        })
    ).current;

    const bottomResizePanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
            onPanResponderGrant: handleResizeStart,
            onPanResponderMove: (_, g) => {
                const newHeight = Math.min(
                    MAX_HEIGHT,
                    Math.max(MIN_SIZE, initialFrameSize.current.height + g.dy * 2)
                );
                setFrameSize((p) => ({ ...p, height: newHeight }));
            }
        })
    ).current;

    const leftResizePanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
            onPanResponderGrant: handleResizeStart,
            onPanResponderMove: (_, g) => {
                const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - g.dx * 2));
                setFrameSize((p) => ({ ...p, width: newWidth }));
            }
        })
    ).current;

    const rightResizePanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
            onPanResponderGrant: handleResizeStart,
            onPanResponderMove: (_, g) => {
                const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + g.dx * 2));
                setFrameSize((p) => ({ ...p, width: newWidth }));
            }
        })
    ).current;

    // ------------------- ЛОГИКА ФОТОГРАФИРОВАНИЯ -------------------
    const takePicture = async () => {
        if (!cameraRef.current || !frameRef.current) return;
        
        // Проверяем статус сервера перед съемкой
        if (serverStatus === 'offline') {
            Alert.alert(
                "Сервер недоступен", 
                "Проверьте:\n1. Запущен ли server.py на компьютере\n2. Корректный ли API ключ в server.py\n3. Правильный ли IP-адрес в настройках",
                [{ text: "Понятно" }]
            );
            return;
        }

        setIsTakingPhoto(true);
        setIsProcessing(true); 

        try {
            let currentSourceRect = null as { x: number, y: number, width: number, height: number } | null;

            // Получаем координаты рамки
            await new Promise<void>((resolve, reject) => {
                if (!frameRef.current) {
                    reject(new Error("Frame ref not available"));
                    return;
                }

                // @ts-ignore
                frameRef.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
                    currentSourceRect = { x: px, y: py, width, height };
                    setSourceRect(currentSourceRect);

                    const availableHeight = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN;
                    const targetY = TOP_MARGIN + (availableHeight - height) / 2;
                    const targetX = (SCREEN_WIDTH - width) / 2;
                    
                    setTargetRect({ x: targetX, y: targetY });
                    resolve();
                });
            });

            if (!currentSourceRect) {
                throw new Error("Не удалось измерить позицию рамки.");
            }

            // Делаем фото
            console.log("📸 Делаем фото...");
            const photo = await cameraRef.current.takePictureAsync({ 
                skipProcessing: false,
                base64: true,
                quality: 0.8,
                exif: true,
            });
            
            if (!photo || !photo.base64) {
                throw new Error("Камера не вернула фото в base64");
            }

            setCapturedPhoto(photo.uri);
            console.log("✅ Фото сделано, отправляем на сервер...");

            // ОТПРАВЛЯЕМ КООРДИНАТЫ РАМКИ ДЛЯ ОБРЕЗКИ
            const requestData = {
                image: photo.base64,
                frame_rect: {
                    x: currentSourceRect.x,
                    y: currentSourceRect.y, 
                    width: currentSourceRect.width,
                    height: currentSourceRect.height
                },
                screen_width: SCREEN_WIDTH,
                screen_height: SCREEN_HEIGHT
            };

            // Отправляем на сервер с таймаутом (3 минуты для DeepSeek R1)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 минуты

            console.log(`📤 Отправляю запрос на: ${SERVER_URL}`);
            const response = await fetch(SERVER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(requestData),
                signal: controller.signal
            });
            
            console.log(`📥 Получен ответ: ${response.status} ${response.statusText}`);

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("📡 Ответ от сервера:", result);

            // ВАЖНОЕ: Показываем обрезанное изображение СРАЗУ после получения от сервера
            // Это будет видно во время обработки DeepSeek
            if (result.cropped_image_base64) {
                const croppedImageBase64 = `data:image/jpeg;base64,${result.cropped_image_base64}`;
                setCroppedImageUri(croppedImageBase64);
                console.log("✅ Обрезанное изображение получено от сервера - показываем пользователю");
                
                // Показываем обрезанное изображение сразу (анимация рамки к верху)
                // Это будет видно пока идет обработка
                Animated.timing(moveFrameAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.cubic) 
                }).start();
            } else {
                console.log("⚠️ Сервер не вернул cropped_image_base64");
            }

            // Обрабатываем ответ
           // Обрабатываем ответ
        if (result && result.success) {
            if (Array.isArray(result.solutions)) {
                setCollectedData({ methods: result.solutions });
                console.log(`✅ Получено ${result.solutions.length} решений от DeepSeek API`);
            } else if (result.solutions && typeof result.solutions === 'object') {
                // Иногда solutions может быть объектом вместо массива
                console.log("⚠️ Solutions is object, converting to array");
                setCollectedData({ methods: [result.solutions] });
            } else {
                // Создаем заглушку, чтобы приложение не падало
                console.log("⚠️ No solutions array, creating fallback");
                setCollectedData({ 
                    methods: [{
                        title: "Решение",
                        formulas: ["Формулы не получены"],
                        answer: "Проверьте ответ сервера",
                        steps: ["Сервер вернул неполные данные"]
                    }] 
                });
            }
        } else {
    throw new Error(result?.message || "Сервер не вернул решения");
}

            // Запускаем анимации успеха
            setTimeout(() => {
                setIsTakingPhoto(false);
                setIsProcessing(false); 
                setShowSolutions(true);
                
                Animated.parallel([
                    Animated.timing(slideAnim, { 
                        toValue: 0, 
                        duration: 420, 
                        useNativeDriver: true,
                        easing: Easing.out(Easing.cubic) 
                    }),
                    Animated.timing(moveFrameAnim, {
                        toValue: 1,
                        duration: 420,
                        useNativeDriver: true,
                        easing: Easing.out(Easing.cubic) 
                    })
                ]).start();
            }, 100);

        } catch (err: any) {
            console.error("❌ Ошибка:", err);
            
            let errorMessage = "Неизвестная ошибка";
            if (err.name === 'AbortError') {
                errorMessage = "Таймаут запроса (2 минуты). Проверьте сервер.";
            } else if (err.message) {
                errorMessage = err.message;
            }

            Alert.alert(
                "Ошибка", 
                `${errorMessage}\n\nПроверьте:\n• Запущен ли server.py\n• Корректный ли API ключ\n• Стабильно ли интернет-соединение`
            );
            
            setIsTakingPhoto(false);
            setIsProcessing(false);
            setCapturedPhoto(null);
            setSourceRect(null); 
            setTargetRect(null);
            setCroppedImageUri(null); // Очищаем обрезанное изображение при ошибке
        }
    };

    const handleCloseSolutions = () => {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: initialPanelTranslate, duration: 250, useNativeDriver: true }),
            Animated.timing(moveFrameAnim, { toValue: 0, duration: 250, useNativeDriver: true })
        ]).start(() => {
            setShowSolutions(false);
            setCapturedPhoto(null);
            setSourceRect(null);
            setTargetRect(null);
            setCollectedData({ methods: [] });
            setCroppedImageUri(null); // Очищаем обрезанное изображение
        });
    };

    const handleCloseWithAlert = () => {
        Alert.alert("Вернуться?", "Хотите вернуться к камере?", [
            {
                text: "Отмена",
                style: "cancel",
                onPress: () => Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start()
            },
            { text: "Да", onPress: handleCloseSolutions }
        ]);
    };

    const handleShowSteps = (index: number) => {
        if (collectedData.methods[index] && collectedData.methods[index].steps) {
            Alert.alert(
                collectedData.methods[index].title, 
                collectedData.methods[index].steps.join("\n\n"),
                [{ text: "Закрыть", style: "cancel" }]
            );
        }
    };

    const handleScroll = (e: any) => {
        setIsScrolledToTop(e.nativeEvent.contentOffset.y <= 10);
    };

    const retryServerConnection = () => {
        setServerStatus('checking');
        checkServerStatus();
    };

    // ------------------- РЕНДЕР ИНДИКАТОРА СТАТУСА -------------------
    const renderStatusIndicator = () => {
        if (serverStatus === 'checking') {
            return (
                <View style={styles.statusContainer}>
                    <ActivityIndicator size="small" color="#666" />
                    <Text style={styles.statusText}>Проверка сервера...</Text>
                </View>
            );
        }

        if (serverStatus === 'offline') {
            return (
                <TouchableOpacity style={styles.statusContainer} onPress={retryServerConnection}>
                    <View style={[styles.statusDot, { backgroundColor: '#ff4444' }]} />
                    <Text style={[styles.statusText, { color: '#ff4444' }]}>Сервер недоступен</Text>
                    <Text style={styles.retryText}>Нажмите для повторной проверки</Text>
                </TouchableOpacity>
            );
        }

        return (
            <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={[styles.statusText, { color: '#4CAF50' }]}>✅ Сервер + API доступны</Text>
            </View>
        );
    };

    // ------------------- РЕНДЕР РЕЗУЛЬТАТА -------------------
    const renderAnimatedResult = () => {
        // Показываем обрезанное изображение если оно есть, иначе показываем полное фото
        const imageToShow = croppedImageUri || capturedPhoto;
        if (!imageToShow) return null;
        
        // Если нет координат для анимации, показываем просто изображение на весь экран
        if (!sourceRect || !targetRect) {
            return (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: "#222" }]}>
                    <Image
                        source={{ uri: imageToShow }}
                        style={StyleSheet.absoluteFill}
                        resizeMode="contain"
                    />
                    {isProcessing && (
                        <View style={styles.processingIndicator}>
                            <ActivityIndicator size="large" color="#ffffff" />
                            <Text style={styles.processingText}>
                                {croppedImageUri 
                                    ? "Обрабатываем задачу в DeepSeek R1..." 
                                    : "Отправляем задачу на сервер..."}
                            </Text>
                            <Text style={styles.processingSubtext}>
                                {croppedImageUri 
                                    ? "Нейросеть анализирует задачу" 
                                    : "Распознавание текста и обрезка изображения"}
                            </Text>
                        </View>
                    )}
                </View>
            );
        }

        const translateY = moveFrameAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [sourceRect.y, targetRect.y]
        });

        const translateX = moveFrameAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [sourceRect.x, targetRect.x]
        });

        return (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "#222" }]}> 
                <Animated.View
                    style={{
                        position: "absolute",
                        width: sourceRect.width,
                        height: sourceRect.height,
                        transform: [{ translateX }, { translateY }],
                        overflow: "hidden", 
                        borderRadius: 4, 
                        borderWidth: 0, 
                        zIndex: 10
                    }}
                >
                    {/* Показываем обрезанное изображение если есть, иначе полное фото */}
                    <Image
                        source={{ uri: imageToShow }}
                        style={{
                            width: sourceRect.width,
                            height: sourceRect.height,
                        }}
                        resizeMode="cover"
                    />
                    
                    <View style={[StyleSheet.absoluteFill, { borderWidth: 2, borderColor: 'white', borderRadius: 4 }]} />
                </Animated.View>
                
                {isProcessing && (
                    <View style={styles.processingIndicator}>
                        <ActivityIndicator size="large" color="#ffffff" />
                        <Text style={styles.processingText}>
                            {croppedImageUri 
                                ? "Обрабатываем задачу в DeepSeek R1..." 
                                : "Отправляем задачу на сервер..."}
                        </Text>
                        <Text style={styles.processingSubtext}>
                            {croppedImageUri 
                                ? "Нейросеть анализирует задачу" 
                                : "Распознавание текста и обрезка изображения"}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    // ------------------- РЕНДЕР КАМЕРЫ -------------------
    const renderCameraContent = () => {
        return (
            <View style={styles.camera}>
                <View style={styles.scannerOverlay}>
                    {/* Индикатор статуса сервера */}
                    {renderStatusIndicator()}

                    <View
                        ref={frameRef}
                        style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}
                    >
                        <View style={styles.cornerTopLeft} />
                        <View style={styles.cornerTopRight} />
                        <View style={styles.cornerBottomLeft} />
                        <View style={styles.cornerBottomRight} />

                        {!isTakingPhoto && !capturedPhoto && !showSolutions && (
                            <>
                                <View {...topResizePanResponder.panHandlers} style={styles.resizeHandleTopArea}>
                                    <View style={styles.resizeHandleVisualHorizontal} />
                                </View>
                                <View {...bottomResizePanResponder.panHandlers} style={styles.resizeHandleBottomArea}>
                                    <View style={styles.resizeHandleVisualHorizontal} />
                                </View>
                                <View {...leftResizePanResponder.panHandlers} style={styles.resizeHandleLeftArea}>
                                    <View style={styles.resizeHandleVisualVertical} />
                                </View>
                                <View {...rightResizePanResponder.panHandlers} style={styles.resizeHandleRightArea}>
                                    <View style={styles.resizeHandleVisualVertical} />
                                </View>
                            </>
                        )}

                        <View style={styles.crosshair}>
                            <View style={styles.crosshairVertical} />
                            <View style={styles.crosshairHorizontal} />
                        </View>
                    </View>

                    <Text style={styles.scannerText}>Наведите рамку на физическую задачу</Text>
                    <Text style={styles.scannerSubtext}>Убедитесь, что текст хорошо виден</Text>
                </View>

                <View style={styles.cameraControls}>
                    {!capturedPhoto && (
                        <TouchableOpacity
                            style={[
                                styles.captureButton, 
                                (isTakingPhoto || serverStatus === 'offline') && styles.captureButtonDisabled
                            ]}
                            onPress={takePicture}
                            disabled={isTakingPhoto || serverStatus === 'offline'} 
                        >
                            <View style={styles.captureButtonInner} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    if (!permission) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#2E86AB" />
                <Text style={styles.loadingText}>Загрузка разрешений...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.permissionText}>Нужен доступ к камере</Text>
                <Text style={styles.permissionSubtext}>Для работы приложения необходимо разрешение на использование камеры</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Разрешить использование камеры</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {(capturedPhoto || croppedImageUri) ? (
                renderAnimatedResult()
            ) : (
                <CameraView 
                    ref={cameraRef} 
                    style={styles.camera} 
                    facing="back"
                >
                    {renderCameraContent()}
                </CameraView>
            )}

            {showSolutions && <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />}

            {showSolutions && (
                <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
                    <View style={styles.closeButtonBackground}>
                        <Text style={styles.closeButtonText}>×</Text>
                    </View>
                </TouchableOpacity>
            )}

            {showSolutions && (
                <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }], zIndex: 2000 }]}>
                    {isScrolledToTop && <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />}

                    <View style={styles.swipeIndicator}>
                        <View style={styles.swipeLine} />
                    </View>

                    <ScrollView 
                        style={styles.solutionsScroll} 
                        contentContainerStyle={styles.scrollContent} 
                        showsVerticalScrollIndicator={false} 
                        onScroll={handleScroll} 
                        scrollEventThrottle={16}
                    >
                        {collectedData.methods.length > 0 ? (
                            collectedData.methods.map((m, i) => (
                                <View key={i} style={styles.solutionWidget}>
                                    <Text style={styles.methodTitle}>{m.title}</Text>

                                    <View style={styles.formulasContainer}>
                                        <Text style={styles.formulasLabel}>Ключевые формулы</Text>
                                        {m.formulas.map((f, fi) => (
                                            <Text key={fi} style={styles.formulaText}>
                                                {f}
                                            </Text>
                                        ))}
                                    </View>

                                    <View style={styles.answerContainer}>
                                        <Text style={styles.answerLabel}>Ответ:</Text>
                                        <Text style={styles.answerText}>{m.answer}</Text>
                                    </View>

                                    <TouchableOpacity style={styles.stepsButton} onPress={() => handleShowSteps(i)}>
                                        <Text style={styles.stepsButtonText}>📋 Показать шаги решения</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <View style={styles.solutionWidget}>
                                <Text style={styles.methodTitle}>Решение не найдено</Text>
                                <Text style={styles.formulasLabel}>
                                    DeepSeek API не смог обработать задачу. Попробуйте:
                                </Text>
                                <Text style={styles.formulaText}>
                                    • Сфотографировать более четко{"\n"}
                                    • Убедиться, что задача физическая{"\n"}
                                    • Проверить баланс API ключа
                                </Text>
                                <TouchableOpacity style={styles.stepsButton} onPress={handleCloseSolutions}>
                                    <Text style={styles.stepsButtonText}>⟲ Попробовать снова</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </Animated.View>
            )}
        </View>
    );
}

// ------------------- СТИЛИ -------------------
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "black" 
    },
    loadingText: {
        color: "white", 
        fontSize: 16, 
        textAlign: "center", 
        marginTop: 20
    },

    // Статус сервера
    statusContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 100
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8
    },
    statusText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600'
    },
    retryText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        marginLeft: 'auto'
    },

    // Разрешения камеры
    permissionText: { 
        color: "white", 
        fontSize: 22, 
        fontWeight: "bold",
        textAlign: "center", 
        marginBottom: 12 
    },
    permissionSubtext: {
        color: "rgba(255,255,255,0.8)", 
        fontSize: 16, 
        textAlign: "center", 
        marginBottom: 30,
        paddingHorizontal: 20,
        lineHeight: 22
    },
    permissionButton: { 
        backgroundColor: "#2E86AB", 
        paddingHorizontal: 30, 
        paddingVertical: 16, 
        borderRadius: 12 
    },
    permissionButtonText: { 
        color: "white", 
        fontSize: 18, 
        fontWeight: "600" 
    },

    camera: { 
        flex: 1 
    },

    scannerOverlay: { 
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center", 
        paddingBottom: 100 
    },
    scannerFrame: {
        borderWidth: 0,
        borderColor: "rgba(255,255,255,0.3)",
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center"
    },

    cornerTopLeft: { 
        position: "absolute", 
        top: -1, 
        left: -1, 
        width: 20, 
        height: 20, 
        borderTopWidth: 3, 
        borderLeftWidth: 3, 
        borderColor: "white" 
    },
    cornerTopRight: { 
        position: "absolute", 
        top: -1, 
        right: -1, 
        width: 20, 
        height: 20, 
        borderTopWidth: 3, 
        borderRightWidth: 3, 
        borderColor: "white" 
    },
    cornerBottomLeft: { 
        position: "absolute", 
        bottom: -1, 
        left: -1, 
        width: 20, 
        height: 20, 
        borderBottomWidth: 3, 
        borderLeftWidth: 3, 
        borderColor: "white" 
    },
    cornerBottomRight: { 
        position: "absolute", 
        bottom: -1, 
        right: -1, 
        width: 20, 
        height: 20, 
        borderBottomWidth: 3, 
        borderRightWidth: 3, 
        borderColor: "white" 
    },

    crosshair: { 
        position: "absolute", 
        alignItems: "center", 
        justifyContent: "center", 
        opacity: 0.5 
    },
    crosshairVertical: { 
        width: 1, 
        height: 15, 
        backgroundColor: "white" 
    },
    crosshairHorizontal: { 
        width: 15, 
        height: 1, 
        backgroundColor: "white", 
        position: "absolute" 
    },

    resizeHandleTopArea: { 
        position: "absolute", 
        top: -20, 
        left: 0, 
        right: 0, 
        height: 40, 
        justifyContent: "center", 
        alignItems: "center", 
        zIndex: 10 
    },
    resizeHandleBottomArea: { 
        position: "absolute", 
        bottom: -20, 
        left: 0, 
        right: 0, 
        height: 40, 
        justifyContent: "center", 
        alignItems: "center", 
        zIndex: 10 
    },
    resizeHandleLeftArea: { 
        position: "absolute", 
        left: -20, 
        top: 0, 
        bottom: 0, 
        width: 40, 
        justifyContent: "center", 
        alignItems: "center", 
        zIndex: 10 
    },
    resizeHandleRightArea: { 
        position: "absolute", 
        right: -20, 
        top: 0, 
        bottom: 0, 
        width: 40, 
        justifyContent: "center", 
        alignItems: "center", 
        zIndex: 10 
    },

    resizeHandleVisualHorizontal: { 
        width: 40, 
        height: 4, 
        backgroundColor: "rgba(255,255,255,0.8)", 
        borderRadius: 2 
    },
    resizeHandleVisualVertical: { 
        width: 4, 
        height: 40, 
        backgroundColor: "rgba(255,255,255,0.8)", 
        borderRadius: 2 
    },

    scannerText: { 
        color: "white", 
        fontSize: 18, 
        fontWeight: "600",
        marginTop: 30, 
        textAlign: "center", 
        textShadowColor: "black", 
        textShadowRadius: 5 
    },
    scannerSubtext: {
        color: "rgba(255,255,255,0.7)", 
        fontSize: 14, 
        marginTop: 8, 
        textAlign: "center", 
        textShadowColor: "black", 
        textShadowRadius: 3
    },

    cameraControls: { 
        position: "absolute", 
        bottom: 40, 
        left: 0, 
        right: 0, 
        alignItems: "center" 
    },
    captureButton: { 
        width: 70, 
        height: 70, 
        borderRadius: 35, 
        backgroundColor: "rgba(255,255,255,0.3)", 
        alignItems: "center", 
        justifyContent: "center" 
    },
    captureButtonDisabled: { 
        opacity: 0.3 
    },
    captureButtonInner: { 
        width: 60, 
        height: 60, 
        borderRadius: 30, 
        backgroundColor: "white" 
    },

    processingIndicator: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    processingText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center'
    },
    processingSubtext: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center'
    },
    
    outsideSwipeArea: { 
        position: "absolute", 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: "40%", 
        backgroundColor: "transparent", 
        zIndex: 1999 
    },
    closeButton: { 
        position: "absolute", 
        top: 50, 
        right: 20, 
        zIndex: 2002 
    },
    closeButtonBackground: { 
        width: 40, 
        height: 40, 
        borderRadius: 20, 
        backgroundColor: "rgba(0, 0, 0, 0.5)", 
        alignItems: "center", 
        justifyContent: "center" 
    },
    closeButtonText: { 
        color: "white", 
        fontSize: 24, 
        fontWeight: "bold", 
        marginTop: -2 
    },

    solutionsContainer: { 
        position: "absolute", 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: "white", 
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20, 
        maxHeight: `${Math.floor(BOTTOM_PANEL_RATIO * 100)}%`, 
        zIndex: 2000 
    },
    overlaySwipeArea: { 
        position: "absolute", 
        top: 0, 
        left: 0, 
        right: 0, 
        height: 60, 
        backgroundColor: "transparent", 
        zIndex: 2001 
    },
    swipeIndicator: { 
        alignItems: "center", 
        paddingTop: 8, 
        paddingBottom: 8, 
        zIndex: 2001 
    },
    swipeLine: { 
        width: 40, 
        height: 4, 
        backgroundColor: "#ccc", 
        borderRadius: 2 
    },
    solutionsScroll: { 
        flex: 1 
    },
    scrollContent: { 
        padding: 16, 
        paddingTop: 0 
    },

    solutionWidget: { 
        backgroundColor: "#f8f9fa", 
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 16, 
        elevation: 3, 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 4 
    },
    methodTitle: { 
        fontSize: 18, 
        fontWeight: "bold", 
        color: "#2c3e50", 
        marginBottom: 12 
    },
    formulasContainer: { 
        backgroundColor: "white", 
        padding: 12, 
        borderRadius: 8, 
        marginBottom: 12 
    },
    formulasLabel: { 
        fontSize: 14, 
        fontWeight: "bold", 
        color: "#2c3e50", 
        marginBottom: 8 
    },
    formulaText: { 
        fontSize: 14, 
        color: "#2c3e50", 
        fontFamily: "monospace", 
        marginBottom: 6, 
        lineHeight: 18 
    },
    answerContainer: { 
        backgroundColor: "#E3F2FD", 
        padding: 12, 
        borderRadius: 8, 
        marginBottom: 12, 
        borderLeftWidth: 4, 
        borderLeftColor: "#2196F3" 
    },
    answerLabel: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#1976D2",
        marginBottom: 4
    },
    answerText: { 
        fontSize: 16, 
        fontWeight: "bold", 
        color: "#1976D2", 
        textAlign: "left" 
    },
    stepsButton: { 
        backgroundColor: "#2196F3", 
        paddingVertical: 12, 
        paddingHorizontal: 20, 
        borderRadius: 8, 
        alignItems: "center" 
    },
    stepsButtonText: { 
        color: "white", 
        fontSize: 14, 
        fontWeight: "600" 
    }
});



