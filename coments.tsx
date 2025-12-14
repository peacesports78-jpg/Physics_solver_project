// import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
// import { useState, useRef } from 'react';
// import { CameraView, useCameraPermissions } from 'expo-camera';
 
// export default function PhysicsSolver() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef<CameraView>(null);
//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере для сканирования задач</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить доступ к камере</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       setIsTakingPhoto(true);
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
//         Alert.alert('Фото сделано!', 'Скоро добавим анализ через DeepSeek AI');
//         // Здесь будет отправка фото в DeepSeek API
//       } catch (error) {
//         Alert.alert('Ошибка', 'Не удалось сделать фото');
//       } finally {
//         setIsTakingPhoto(false);
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <CameraView 
//         ref={cameraRef}
//         style={styles.camera}
//         facing="back"
//       >
//         {/* РАМКА СКАНЕРА КАК В PHOTOMATH */}
//         <View style={styles.scannerOverlay}>
//           <View style={styles.scannerFrame} />
//           <Text style={styles.scannerText}>Наведите на задачу по физике</Text>
//         </View>

//         {/* КНОПКА СФОТОГРАФИРОВАТЬ */}
//         <View style={styles.cameraControls}>
//           <TouchableOpacity 
//             style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//             onPress={takePicture}
//             disabled={isTakingPhoto}
//           >
//             <View style={styles.captureButtonInner} />
//           </TouchableOpacity>
//         </View>
//       </CameraView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   permissionText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   permissionButton: {
//     backgroundColor: '#2E86AB',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderRadius: 10,
//   },
//   permissionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   camera: {
//     flex: 1,
//   },
//   scannerOverlay: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   scannerFrame: {
//     width: 300,
//     height: 200,
//     borderWidth: 2,
//     borderColor: 'white',
//     borderRadius: 12,
//     backgroundColor: 'transparent',
//   },
//   scannerText: {
//     color: 'white',
//     fontSize: 16,
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   cameraControls: {
//     position: 'absolute',
//     bottom: 40,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   captureButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'white',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   captureButtonDisabled: {
//     opacity: 0.5,
//   },
//   captureButtonInner: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'white',
//     borderWidth: 3,
//     borderColor: 'black',
//   },
// });




// // 2222222222222222222222222222222222222222222222222222222222222222222222222
// import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Animated } from 'react-native';
// import { useState, useRef, useEffect } from 'react';
// import { CameraView, useCameraPermissions } from 'expo-camera';

// export default function PhysicsSolver() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef<CameraView>(null);
//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [showSolutions, setShowSolutions] = useState(false);
//   const slideAnim = useRef(new Animated.Value(300)).current; // Для анимации выезжания

//   // Данные для виджетов (пока статические)
//   const solutionData = {
//     problem: "Три точечных заряда по 1,7 мКл каждый находятся в вершинах равностороннего треугольника. Какой заряд надо поместить в центре треугольника, чтобы все системы находились в равновесии?",
//     methods: [
//       {
//         title: "Способ 1. Через геометрию и равнодействующую силу",
//         formulas: [
//           "Закон Кулона: F = k |q₁q₂|/r²",
//           "Расстояние от центра до вершины: R = a/√3"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Рассмотрим силы...", "Шаг 2: Приравняем равнодействующую..."]
//       },
//       {
//         title: "Способ 2. Через потенциал и энергию", 
//         formulas: [
//           "Потенциал в центре: φ = 3kq/R",
//           "R = a/√3"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Найдем потенциал...", "Шаг 2: Используем условие равновесия..."]
//       }
//     ]
//   };

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       setIsTakingPhoto(true);
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
        
//         // Имитация анализа фото
//         setTimeout(() => {
//           setIsTakingPhoto(false);
//           setShowSolutions(true);
          
//           // Анимация выезжания виджетов
//           Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 500,
//             useNativeDriver: true,
//           }).start();
//         }, 1500);
        
//       } catch (error) {
//         Alert.alert('Ошибка', 'Не удалось сделать фото');
//         setIsTakingPhoto(false);
//       }
//     }
//   };

//   const handleShowSteps = (methodIndex: number) => {
//     Alert.alert(
//       `Шаги решения - ${solutionData.methods[methodIndex].title}`,
//       solutionData.methods[methodIndex].steps.join('\n\n')
//     );
//   };

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере для сканирования задач</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить доступ к камере</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView 
//         ref={cameraRef}
//         style={styles.camera}
//         facing="back"
//       >
//         {/* РАМКА СКАНЕРА - смещается вверх при показе решений */}
//         <View style={[styles.scannerOverlay, showSolutions && styles.scannerShifted]}>
//           <View style={styles.scannerFrame} />
//           <Text style={styles.scannerText}>
//             {showSolutions ? "Задача захвачена" : "Наведите на задачу по физике"}
//           </Text>
//         </View>

//         {/* КНОПКА СФОТОГРАФИРОВАТЬ */}
//         <View style={styles.cameraControls}>
//           <TouchableOpacity 
//             style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//             onPress={takePicture}
//             disabled={isTakingPhoto}
//           >
//             <View style={styles.captureButtonInner} />
//           </TouchableOpacity>
//         </View>
//       </CameraView>

//       {/* ВИДЖЕТЫ РЕШЕНИЙ - выезжают снизу */}
//       {showSolutions && (
//         <Animated.View 
//           style={[
//             styles.solutionsContainer,
//             { transform: [{ translateY: slideAnim }] }
//           ]}
//         >
//           <ScrollView 
//             style={styles.solutionsScroll}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//           >
//             {solutionData.methods.map((method, index) => (
//               <View key={index} style={styles.solutionWidget}>
//                 <Text style={styles.methodTitle}>{method.title}</Text>
                
//                 <View style={styles.formulasContainer}>
//                   {method.formulas.map((formula, formulaIndex) => (
//                     <Text key={formulaIndex} style={styles.formulaText}>{formula}</Text>
//                   ))}
//                 </View>
                
//                 <View style={styles.answerContainer}>
//                   <Text style={styles.answerText}>{method.answer}</Text>
//                 </View>
                
//                 <TouchableOpacity 
//                   style={styles.stepsButton}
//                   onPress={() => handleShowSteps(index)}
//                 >
//                   <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   permissionText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   permissionButton: {
//     backgroundColor: '#2E86AB',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderRadius: 10,
//   },
//   permissionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   camera: {
//     flex: 1,
//   },
//   scannerOverlay: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingBottom: 100, // Место для виджетов
//   },
//   scannerShifted: {
//     paddingBottom: 250, // Больше места когда виджеты показаны
//     justifyContent: 'flex-start',
//     paddingTop: 50, // Смещаем рамку вверх
//   },
//   scannerFrame: {
//     width: 300,
//     height: 200,
//     borderWidth: 2,
//     borderColor: 'white',
//     borderRadius: 12,
//     backgroundColor: 'transparent',
//   },
//   scannerText: {
//     color: 'white',
//     fontSize: 16,
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   cameraControls: {
//     position: 'absolute',
//     bottom: 40,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   captureButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'white',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   captureButtonDisabled: {
//     opacity: 0.5,
//   },
//   captureButtonInner: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'white',
//     borderWidth: 3,
//     borderColor: 'black',
//   },
//   // СТИЛИ ДЛЯ ВИДЖЕТОВ РЕШЕНИЙ
//   solutionsContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '60%', // Не перекрывает всю камеру
//   },
//   solutionsScroll: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 16,
//   },
//   solutionWidget: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12, // MARGIN между виджетами
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   methodTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 12,
//   },
//   formulasContainer: {
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   formulaText: {
//     fontSize: 14,
//     color: '#2c3e50',
//     fontFamily: 'monospace',
//     marginBottom: 4,
//   },
//   answerContainer: {
//     backgroundColor: '#e8f5e8',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   answerText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#27ae60',
//     textAlign: 'center',
//   },
//   stepsButton: {
//     backgroundColor: '#3498db',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   stepsButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });



// 3333333333333333333333333333333333333333333333333
// import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Animated } from 'react-native';
// import { useState, useRef, useEffect } from 'react';
// import { CameraView, useCameraPermissions } from 'expo-camera';

// export default function PhysicsSolver() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef<CameraView>(null);
//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [showSolutions, setShowSolutions] = useState(false);
//   const slideAnim = useRef(new Animated.Value(300)).current;

//   // Данные для виджетов (пока статические)
//   const solutionData = {
//     problem: "Три точечных заряда по 1,7 мКл каждый находятся в вершинах равностороннего треугольника. Какой заряд надо поместить в центре треугольника, чтобы все системы находились в равновесии?",
//     methods: [
//       {
//         title: "Способ 1. Через геометрию и равнодействующую силу",
//         formulas: [
//           "Закон Кулона: F = k |q₁q₂|/r²",
//           "Расстояние от центра до вершины: R = a/√3"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Рассмотрим силы...", "Шаг 2: Приравняем равнодействующую..."]
//       },
//       {
//         title: "Способ 2. Через потенциал и энергию", 
//         formulas: [
//           "Потенциал в центре: φ = 3kq/R",
//           "R = a/√3"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Найдем потенциал...", "Шаг 2: Используем условие равновесия..."]
//       }
//     ]
//   };

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       setIsTakingPhoto(true);
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
        
//         // Имитация анализа фото
//         setTimeout(() => {
//           setIsTakingPhoto(false);
//           setShowSolutions(true);
          
//           // Анимация выезжания виджетов
//           Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 500,
//             useNativeDriver: true,
//           }).start();
//         }, 1500);
        
//       } catch (error) {
//         Alert.alert('Ошибка', 'Не удалось сделать фото');
//         setIsTakingPhoto(false);
//       }
//     }
//   };

//   const handleShowSteps = (methodIndex: number) => {
//     Alert.alert(
//       `Шаги решения - ${solutionData.methods[methodIndex].title}`,
//       solutionData.methods[methodIndex].steps.join('\n\n')
//     );
//   };

//   const handleCloseSolutions = () => {
//     Alert.alert(
//       'Вернуться к камере?',
//       'Вы уверены, что хотите вернуться к сканированию?',
//       [
//         {
//           text: 'Отмена',
//           style: 'cancel',
//         },
//         {
//           text: 'Да',
//           onPress: () => {
//             // Анимация скрытия виджетов
//             Animated.timing(slideAnim, {
//               toValue: 300,
//               duration: 300,
//               useNativeDriver: true,
//             }).start(() => {
//               setShowSolutions(false);
//             });
//           },
//         },
//       ]
//     );
//   };

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере для сканирования задач</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить доступ к камере</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView 
//         ref={cameraRef}
//         style={styles.camera}
//         facing="back"
//       >
//         {/* РАМКА СКАНЕРА - смещается вверх при показе решений */}
//         <View style={[styles.scannerOverlay, showSolutions && styles.scannerShifted]}>
//           <View style={styles.scannerFrame} />
//           <Text style={styles.scannerText}>
//             {showSolutions ? "Задача захвачена" : "Наведите на задачу по физике"}
//           </Text>
//         </View>

//         {/* КНОПКА СФОТОГРАФИРОВАТЬ */}
//         <View style={styles.cameraControls}>
//           <TouchableOpacity 
//             style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//             onPress={takePicture}
//             disabled={isTakingPhoto}
//           >
//             <View style={styles.captureButtonInner} />
//           </TouchableOpacity>
//         </View>

//         {/* ПОЛУПРОЗРАЧНЫЙ КРЕСТИК ДЛЯ ВОЗВРАТА (только когда есть решения) */}
//         {showSolutions && (
//           <TouchableOpacity 
//             style={styles.closeButton}
//             onPress={handleCloseSolutions}
//           >
//             <View style={styles.closeButtonBackground}>
//               <Text style={styles.closeButtonText}>×</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       </CameraView>

//       {/* ВИДЖЕТЫ РЕШЕНИЙ - выезжают снизу */}
//       {showSolutions && (
//         <Animated.View 
//           style={[
//             styles.solutionsContainer,
//             { transform: [{ translateY: slideAnim }] }
//           ]}
//         >
//           <ScrollView 
//             style={styles.solutionsScroll}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//           >
//             {solutionData.methods.map((method, index) => (
//               <View key={index} style={styles.solutionWidget}>
//                 <Text style={styles.methodTitle}>{method.title}</Text>
                
//                 <View style={styles.formulasContainer}>
//                   {method.formulas.map((formula, formulaIndex) => (
//                     <Text key={formulaIndex} style={styles.formulaText}>{formula}</Text>
//                   ))}
//                 </View>
                
//                 <View style={styles.answerContainer}>
//                   <Text style={styles.answerText}>{method.answer}</Text>
//                 </View>
                
//                 <TouchableOpacity 
//                   style={styles.stepsButton}
//                   onPress={() => handleShowSteps(index)}
//                 >
//                   <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   permissionText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   permissionButton: {
//     backgroundColor: '#2E86AB',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderRadius: 10,
//   },
//   permissionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   camera: {
//     flex: 1,
//   },
//   scannerOverlay: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingBottom: 100,
//   },
//   scannerShifted: {
//     paddingBottom: 250,
//     justifyContent: 'flex-start',
//     paddingTop: 50,
//   },
//   scannerFrame: {
//     width: 300,
//     height: 200,
//     borderWidth: 2,
//     borderColor: 'white',
//     borderRadius: 12,
//     backgroundColor: 'transparent',
//   },
//   scannerText: {
//     color: 'white',
//     fontSize: 16,
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   cameraControls: {
//     position: 'absolute',
//     bottom: 40,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   captureButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'white',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   captureButtonDisabled: {
//     opacity: 0.5,
//   },
//   captureButtonInner: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'white',
//     borderWidth: 3,
//     borderColor: 'black',
//   },
//   // СТИЛИ ДЛЯ КРЕСТИКА
//   closeButton: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     zIndex: 1000,
//   },
//   closeButtonBackground: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачный черный
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   closeButtonText: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: -2,
//   },
//   // СТИЛИ ДЛЯ ВИДЖЕТОВ РЕШЕНИЙ
//   solutionsContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '60%',
//   },
//   solutionsScroll: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 16,
//   },
//   solutionWidget: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   methodTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 12,
//   },
//   formulasContainer: {
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   formulaText: {
//     fontSize: 14,
//     color: '#2c3e50',
//     fontFamily: 'monospace',
//     marginBottom: 4,
//   },
//   answerContainer: {
//     backgroundColor: '#e8f5e8',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   answerText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#27ae60',
//     textAlign: 'center',
//   },
//   stepsButton: {
//     backgroundColor: '#3498db',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   stepsButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });


// 44444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444
// import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Animated, PanResponder } from 'react-native';
// import { useState, useRef, useEffect } from 'react';
// import { CameraView, useCameraPermissions } from 'expo-camera';

// export default function PhysicsSolver() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef<CameraView>(null);
//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [showSolutions, setShowSolutions] = useState(false);
//   const slideAnim = useRef(new Animated.Value(300)).current;
//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, gestureState) => {
//         return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
//       },
//       onPanResponderMove: (_, gestureState) => {
//         if (gestureState.dy > 0) { // Только скролл вниз
//           slideAnim.setValue(gestureState.dy);
//         }
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (gestureState.dy > 100) { // Если проскроллили больше 25%
//           handleCloseSolutions();
//         } else {
//           // Возвращаем на место
//           Animated.spring(slideAnim, {
//             toValue: 0,
//             useNativeDriver: true,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   // Данные для виджетов (пока статические)
//   const solutionData = {
//     problem: "Три точечных заряда по 1,7 мКл каждый находятся в вершинах равностороннего треугольника. Какой заряд надо поместить в центре треугольника, чтобы все системы находились в равновесии?",
//     methods: [
//       {
//         title: "Способ 1. Через геометрию и равнодействующую силу",
//         formulas: [
//           "Закон Кулона: F = k |q₁q₂|/r²",
//           "Расстояние от центра до вершины: R = a/√3"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Рассмотрим силы...", "Шаг 2: Приравняем равнодействующую..."]
//       },
//       {
//         title: "Способ 2. Через потенциал и энергию", 
//         formulas: [
//           "Потенциал в центре: φ = 3kq/R",
//           "R = a/√3"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Найдем потенциал...", "Шаг 2: Используем условие равновесия..."]
//       }
//     ]
//   };

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       setIsTakingPhoto(true);
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
        
//         // Имитация анализа фото
//         setTimeout(() => {
//           setIsTakingPhoto(false);
//           setShowSolutions(true);
          
//           // Анимация выезжания виджетов
//           Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 500,
//             useNativeDriver: true,
//           }).start();
//         }, 1500);
        
//       } catch (error) {
//         Alert.alert('Ошибка', 'Не удалось сделать фото');
//         setIsTakingPhoto(false);
//       }
//     }
//   };

//   const handleShowSteps = (methodIndex: number) => {
//     Alert.alert(
//       `Шаги решения - ${solutionData.methods[methodIndex].title}`,
//       solutionData.methods[methodIndex].steps.join('\n\n')
//     );
//   };

//   const handleCloseSolutions = () => {
//     // Анимация скрытия виджетов
//     Animated.timing(slideAnim, {
//       toValue: 300,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setShowSolutions(false);
//     });
//   };

//   const handleCloseWithAlert = () => {
//     Alert.alert(
//       'Вернуться к камере?',
//       'Вы уверены, что хотите вернуться к сканированию?',
//       [
//         {
//           text: 'Отмена',
//           style: 'cancel',
//         },
//         {
//           text: 'Да',
//           onPress: handleCloseSolutions,
//         },
//       ]
//     );
//   };

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере для сканирования задач</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить доступ к камере</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView 
//         ref={cameraRef}
//         style={styles.camera}
//         facing="back"
//       >
//         {/* РАМКА СКАНЕРА - смещается вверх при показе решений */}
//         <View style={[styles.scannerOverlay, showSolutions && styles.scannerShifted]}>
//           <View style={styles.scannerFrame} />
//           {/* МИНИМАЛИСТИЧНЫЙ ОТРЕЗОК вместо надписи */}
//           {showSolutions && (
//             <View style={styles.minimalIndicator}>
//               <View style={styles.indicatorLine} />
//             </View>
//           )}
//           <Text style={styles.scannerText}>
//             {showSolutions ? "" : "Наведите на задачу по физике"}
//           </Text>
//         </View>

//         {/* КНОПКА СФОТОГРАФИРОВАТЬ */}
//         <View style={styles.cameraControls}>
//           <TouchableOpacity 
//             style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//             onPress={takePicture}
//             disabled={isTakingPhoto}
//           >
//             <View style={styles.captureButtonInner} />
//           </TouchableOpacity>
//         </View>

//         {/* ПОЛУПРОЗРАЧНЫЙ КРЕСТИК ДЛЯ ВОЗВРАТА (только когда есть решения) */}
//         {showSolutions && (
//           <TouchableOpacity 
//             style={styles.closeButton}
//             onPress={handleCloseWithAlert}
//           >
//             <View style={styles.closeButtonBackground}>
//               <Text style={styles.closeButtonText}>×</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       </CameraView>

//       {/* ВИДЖЕТЫ РЕШЕНИЙ - выезжают снизу с поддержкой свайпа */}
//       {showSolutions && (
//         <Animated.View 
//           style={[
//             styles.solutionsContainer,
//             { transform: [{ translateY: slideAnim }] }
//           ]}
//           {...panResponder.panHandlers}
//         >
//           {/* ИНДИКАТОР ДЛЯ СВАЙПА */}
//           <View style={styles.swipeIndicator}>
//             <View style={styles.swipeLine} />
//           </View>
          
//           <ScrollView 
//             style={styles.solutionsScroll}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//           >
//             {solutionData.methods.map((method, index) => (
//               <View key={index} style={styles.solutionWidget}>
//                 <Text style={styles.methodTitle}>{method.title}</Text>
                
//                 <View style={styles.formulasContainer}>
//                   {method.formulas.map((formula, formulaIndex) => (
//                     <Text key={formulaIndex} style={styles.formulaText}>{formula}</Text>
//                   ))}
//                 </View>
                
//                 <View style={styles.answerContainer}>
//                   <Text style={styles.answerText}>{method.answer}</Text>
//                 </View>
                
//                 <TouchableOpacity 
//                   style={styles.stepsButton}
//                   onPress={() => handleShowSteps(index)}
//                 >
//                   <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   permissionText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   permissionButton: {
//     backgroundColor: '#2E86AB',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderRadius: 10,
//   },
//   permissionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   camera: {
//     flex: 1,
//   },
//   scannerOverlay: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingBottom: 100,
//   },
//   scannerShifted: {
//     paddingBottom: 250,
//     justifyContent: 'flex-start',
//     paddingTop: 50,
//   },
//   scannerFrame: {
//     width: 300,
//     height: 200,
//     borderWidth: 2,
//     borderColor: 'white',
//     borderRadius: 12,
//     backgroundColor: 'transparent',
//   },
//   scannerText: {
//     color: 'white',
//     fontSize: 16,
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   // МИНИМАЛИСТИЧНЫЙ ОТРЕЗОК
//   minimalIndicator: {
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   indicatorLine: {
//     width: 40,
//     height: 4,
//     backgroundColor: 'rgba(255, 255, 255, 0.6)',
//     borderRadius: 2,
//   },
//   cameraControls: {
//     position: 'absolute',
//     bottom: 40,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   captureButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'white',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   captureButtonDisabled: {
//     opacity: 0.5,
//   },
//   captureButtonInner: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'white',
//     borderWidth: 3,
//     borderColor: 'black',
//   },
//   // СТИЛИ ДЛЯ КРЕСТИКА
//   closeButton: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     zIndex: 1000,
//   },
//   closeButtonBackground: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   closeButtonText: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: -2,
//   },
//   // СТИЛИ ДЛЯ ВИДЖЕТОВ РЕШЕНИЙ И СВАЙПА
//   solutionsContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '60%',
//   },
//   swipeIndicator: {
//     alignItems: 'center',
//     paddingTop: 8,
//     paddingBottom: 8,
//   },
//   swipeLine: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#ccc',
//     borderRadius: 2,
//   },
//   solutionsScroll: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 16,
//     paddingTop: 0,
//   },
//   solutionWidget: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   methodTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 12,
//   },
//   formulasContainer: {
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   formulaText: {
//     fontSize: 14,
//     color: '#2c3e50',
//     fontFamily: 'monospace',
//     marginBottom: 4,
//   },
//   answerContainer: {
//     backgroundColor: '#e8f5e8',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   answerText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#27ae60',
//     textAlign: 'center',
//   },
//   stepsButton: {
//     backgroundColor: '#3498db',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   stepsButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });


// 555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
// import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Animated, PanResponder } from 'react-native';
// import { useState, useRef } from 'react';
// import { CameraView, useCameraPermissions } from 'expo-camera';

// export default function PhysicsSolver() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef<CameraView>(null);
//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [showSolutions, setShowSolutions] = useState(false);
//   const [isScrolledToTop, setIsScrolledToTop] = useState(false);
//   const slideAnim = useRef(new Animated.Value(300)).current;
//   const scrollViewRef = useRef(null);

//   // PanResponder для области ВНЕ белого блока
//   const outsidePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, gestureState) => {
//         return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
//       },
//       onPanResponderMove: (_, gestureState) => {
//         if (gestureState.dy > 0) {
//           slideAnim.setValue(gestureState.dy);
//         }
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (gestureState.dy > 50) {
//           handleCloseWithAlert();
//         } else {
//           Animated.spring(slideAnim, {
//             toValue: 0,
//             useNativeDriver: true,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   // PanResponder для СВАЙПА РЕШЕНИЙ (когда уперлись в потолок)
//   const solutionsPanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => isScrolledToTop,
//       onMoveShouldSetPanResponder: (_, gestureState) => {
//         return isScrolledToTop && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
//       },
//       onPanResponderMove: (_, gestureState) => {
//         if (isScrolledToTop && gestureState.dy > 0) {
//           slideAnim.setValue(gestureState.dy);
//         }
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (isScrolledToTop && gestureState.dy > 50) {
//           handleCloseWithAlert();
//         } else {
//           Animated.spring(slideAnim, {
//             toValue: 0,
//             useNativeDriver: true,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   // Данные для виджетов
//   const solutionData = {
//     methods: [
//       {
//         title: "Способ 1. Через геометрию и равнодействующую силу",
//         formulas: [
//           "Закон Кулона: F = k |q₁q₂|/r²",
//           "Расстояние от центра до вершины: R = a/√3"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Рассмотрим силы...", "Шаг 2: Приравняем равнодействующую..."]
//       },
//       {
//         title: "Способ 2. Через потенциал и энергию", 
//         formulas: [
//           "Потенциал в центре: φ = 3kq/R",
//           "R = a/√3"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Найдем потенциал...", "Шаг 2: Используем условие равновесия..."]
//       },
//       {
//         title: "Способ 3. Через симметрию системы",
//         formulas: [
//           "Сила от каждого заряда: F₁ = F₂ = F₃",
//           "Условие равновесия: ΣF = 0"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Учитываем симметрию...", "Шаг 2: Составляем уравнение..."]
//       }
//     ]
//   };

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       setIsTakingPhoto(true);
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
        
//         setTimeout(() => {
//           setIsTakingPhoto(false);
//           setShowSolutions(true);
//           setIsScrolledToTop(false);
          
//           Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 500,
//             useNativeDriver: true,
//           }).start();
//         }, 1500);
        
//       } catch (error) {
//         Alert.alert('Ошибка', 'Не удалось сделать фото');
//         setIsTakingPhoto(false);
//       }
//     }
//   };

//   const handleShowSteps = (methodIndex: number) => {
//     Alert.alert(
//       `Шаги решения - ${solutionData.methods[methodIndex].title}`,
//       solutionData.methods[methodIndex].steps.join('\n\n')
//     );
//   };

//   const handleCloseSolutions = () => {
//     Animated.timing(slideAnim, {
//       toValue: 300,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setShowSolutions(false);
//       setIsScrolledToTop(false);
//     });
//   };

//   const handleCloseWithAlert = () => {
//     Alert.alert(
//       'Вернуться к камере?',
//       'Вы уверены, что хотите вернуться к сканированию?',
//       [
//         {
//           text: 'Отмена',
//           style: 'cancel',
//         },
//         {
//           text: 'Да',
//           onPress: handleCloseSolutions,
//         },
//       ]
//     );
//   };

//   // Проверка скролла до верха
//   const handleScroll = (event: any) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     setIsScrolledToTop(offsetY <= 10);
//   };

   
//   const scrollViewPanResponder = useRef(
//   PanResponder.create({
//       onStartShouldSetPanResponder: () => isScrolledToTop,
//       onMoveShouldSetPanResponder: (_, gestureState) => {
//         return isScrolledToTop && gestureState.dy > 0;
//       },
//       onPanResponderMove: (_, gestureState) => {
//         if (isScrolledToTop && gestureState.dy > 0) {
//           slideAnim.setValue(gestureState.dy);
//         }
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (isScrolledToTop && gestureState.dy > 50) {
//           handleCloseWithAlert();
//         } else {
//           Animated.spring(slideAnim, {
//             toValue: 0,
//             useNativeDriver: true,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере для сканирования задач</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить доступ к камере</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView 
//         ref={cameraRef}
//         style={styles.camera}
//         facing="back"
//       >
//         <View style={[styles.scannerOverlay, showSolutions && styles.scannerShifted]}>
//           <View style={styles.scannerFrame} />
//           {showSolutions && (
//             <View style={styles.minimalIndicator}>
//               <View style={styles.indicatorLine} />
//             </View>
//           )}
//           <Text style={styles.scannerText}>
//             {showSolutions ? "" : "Наведите на задачу по физике"}
//           </Text>
//         </View>

//         <View style={styles.cameraControls}>
//           <TouchableOpacity 
//             style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//             onPress={takePicture}
//             disabled={isTakingPhoto}
//           >
//             <View style={styles.captureButtonInner} />
//           </TouchableOpacity>
//         </View>
//       </CameraView>

//       {showSolutions && (
//         <View style={styles.outsideSwipeArea} {...outsidePanResponder.panHandlers} />
//       )}

//       {showSolutions && (
//         <TouchableOpacity 
//           style={styles.closeButton}
//           onPress={handleCloseWithAlert}
//         >
//           <View style={styles.closeButtonBackground}>
//             <Text style={styles.closeButtonText}>×</Text>
//           </View>
//         </TouchableOpacity>
//       )}

//       {showSolutions && (
//         <Animated.View 
//           style={[
//             styles.solutionsContainer,
//             { transform: [{ translateY: slideAnim }] }
//           ]}
//           {...solutionsPanResponder.panHandlers}
//         >
//           <View style={styles.swipeIndicator}>
//             <View style={styles.swipeLine} />
//           </View>
          
//           <ScrollView 
//             ref={scrollViewRef}
//             style={styles.solutionsScroll}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//             onScroll={handleScroll}
//             scrollEventThrottle={16}
//           >
//             {solutionData.methods.map((method, index) => (
//               <View key={index} style={styles.solutionWidget}>
//                 <Text style={styles.methodTitle}>{method.title}</Text>
                
//                 <View style={styles.formulasContainer}>
//                   {method.formulas.map((formula, formulaIndex) => (
//                     <Text key={formulaIndex} style={styles.formulaText}>{formula}</Text>
//                   ))}
//                 </View>
                
//                 <View style={styles.answerContainer}>
//                   <Text style={styles.answerText}>{method.answer}</Text>
//                 </View>
                
//                 <TouchableOpacity 
//                   style={styles.stepsButton}
//                   onPress={() => handleShowSteps(index)}
//                 >
//                   <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   permissionText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   permissionButton: {
//     backgroundColor: '#2E86AB',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderRadius: 10,
//   },
//   permissionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   camera: {
//     flex: 1,
//   },
//   scannerOverlay: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingBottom: 100,
//   },
//   scannerShifted: {
//     paddingBottom: 250,
//     justifyContent: 'flex-start',
//     paddingTop: 50,
//   },
//   scannerFrame: {
//     width: 300,
//     height: 200,
//     borderWidth: 2,
//     borderColor: 'white',
//     borderRadius: 12,
//     backgroundColor: 'transparent',
//   },
//   scannerText: {
//     color: 'white',
//     fontSize: 16,
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   minimalIndicator: {
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   indicatorLine: {
//     width: 40,
//     height: 4,
//     backgroundColor: 'rgba(255, 255, 255, 0.6)',
//     borderRadius: 2,
//   },
//   cameraControls: {
//     position: 'absolute',
//     bottom: 40,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   captureButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'white',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   captureButtonDisabled: {
//     opacity: 0.5,
//   },
//   captureButtonInner: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'white',
//     borderWidth: 3,
//     borderColor: 'black',
//   },
//   outsideSwipeArea: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: '40%',
//     backgroundColor: 'transparent',
//     zIndex: 999,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     zIndex: 1001,
//   },
//   closeButtonBackground: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   closeButtonText: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: -2,
//   },
//   solutionsContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '60%',
//     zIndex: 1000,
//   },
//   swipeIndicator: {
//     alignItems: 'center',
//     paddingTop: 8,
//     paddingBottom: 8,
//   },
//   swipeLine: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#ccc',
//     borderRadius: 2,
//   },
//   solutionsScroll: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 16,
//     paddingTop: 0,
//   },
//   solutionWidget: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   methodTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 12,
//   },
//   formulasContainer: {
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   formulaText: {
//     fontSize: 14,
//     color: '#2c3e50',
//     fontFamily: 'monospace',
//     marginBottom: 4,
//   },
//   answerContainer: {
//     backgroundColor: '#e8f5e8',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   answerText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#27ae60',
//     textAlign: 'center',
//   },
//   stepsButton: {
//     backgroundColor: '#3498db',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   stepsButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });




// 66666666666666666666666666666666666666666666666666666666666
// import { testDeepSeekAPI } from '../../services/deepseekService';
// import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Animated, PanResponder } from 'react-native';
// import { useState, useRef } from 'react';
// import { CameraView, useCameraPermissions } from 'expo-camera';

// export default function PhysicsSolver() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef<CameraView>(null);
//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [showSolutions, setShowSolutions] = useState(false);
//   const [isScrolledToTop, setIsScrolledToTop] = useState(true);
//   const slideAnim = useRef(new Animated.Value(300)).current;
//   const scrollViewRef = useRef(null);

//   // PanResponder для свайпа
//   const swipePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, gestureState) => {
//         return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
//       },
//       onPanResponderMove: (_, gestureState) => {
//         if (gestureState.dy > 0) {
//           slideAnim.setValue(gestureState.dy);
//         }
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (gestureState.dy > 80) {
//           handleCloseWithAlert();
//         } else {
//           Animated.spring(slideAnim, {
//             toValue: 0,
//             useNativeDriver: true,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   // Данные для виджетов
//   const solutionData = {
//     methods: [
//       {
//         title: "Способ 1. Через геометрию и равнодействующую силу",
//         formulas: [
//           "Закон Кулона: F = k |q₁q₂|/r²",
//           "Расстояние от центра до вершины: R = a/√3"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Рассмотрим силы...", "Шаг 2: Приравняем равнодействующую..."]
//       },
//       {
//         title: "Способ 2. Через потенциал и энергию", 
//         formulas: [
//           "Потенциал в центре: φ = 3kq/R",
//           "R = a/√3"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Найдем потенциал...", "Шаг 2: Используем условие равновесия..."]
//       },
//       {
//         title: "Способ 3. Через симметрию системы",
//         formulas: [
//           "Сила от каждого заряда: F₁ = F₂ = F₃",
//           "Условие равновесия: ΣF = 0"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Учитываем симметрию...", "Шаг 2: Составляем уравнение..."]
//       }
//     ]
//   };

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       setIsTakingPhoto(true);
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
        
//         setTimeout(() => {
//           setIsTakingPhoto(false);
//           setShowSolutions(true);
//           setIsScrolledToTop(true);
          
//           Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 500,
//             useNativeDriver: true,
//           }).start();
//         }, 1500);
        
//       } catch (error) {
//         Alert.alert('Ошибка', 'Не удалось сделать фото');
//         setIsTakingPhoto(false);
//       }
//     }
//   };

//   const handleShowSteps = (methodIndex: number) => {
//     Alert.alert(
//       `Шаги решения - ${solutionData.methods[methodIndex].title}`,
//       solutionData.methods[methodIndex].steps.join('\n\n')
//     );
//   };

//   const handleCloseSolutions = () => {
//     Animated.timing(slideAnim, {
//       toValue: 300,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setShowSolutions(false);
//     });
//   };

//   const handleCloseWithAlert = () => {
//     Alert.alert(
//       'Вернуться к камере?',
//       'Вы уверены, что хотите вернуться к сканированию?',
//       [
//         {
//           text: 'Отмена',
//           style: 'cancel',
//           onPress: () => {
//             Animated.spring(slideAnim, {
//               toValue: 0,
//               useNativeDriver: true,
//             }).start();
//           },
//         },
//         {
//           text: 'Да',
//           onPress: handleCloseSolutions,
//         },
//       ]
//     );
//   };

//   // Проверка скролла до верха
//   const handleScroll = (event: any) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     setIsScrolledToTop(offsetY <= 10);
//   };

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере для сканирования задач</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить доступ к камере</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView 
//         ref={cameraRef}
//         style={styles.camera}
//         facing="back"
//       >
//         <View style={[styles.scannerOverlay, showSolutions && styles.scannerShifted]}>
//           <View style={styles.scannerFrame} />
//           {showSolutions && (
//             <View style={styles.minimalIndicator}>
//               <View style={styles.indicatorLine} />
//             </View>
//           )}
//           <Text style={styles.scannerText}>
//             {showSolutions ? "" : "Наведите на задачу по физике"}
//           </Text>
//         </View>

//         <View style={styles.cameraControls}>
//           <TouchableOpacity 
//             style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//             onPress={takePicture}
//             disabled={isTakingPhoto}
//           >
//             <View style={styles.captureButtonInner} />
//           </TouchableOpacity>
//         </View>
//       </CameraView>

//       {/* ОБЛАСТЬ ДЛЯ СВАЙПА СНАРУЖИ БЕЛОГО БЛОКА */}
//       {showSolutions && (
//         <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />
//       )}

//       {/* КРЕСТИК */}
//       {showSolutions && (
//         <TouchableOpacity 
//           style={styles.closeButton}
//           onPress={handleCloseWithAlert}
//         >
//           <View style={styles.closeButtonBackground}>
//             <Text style={styles.closeButtonText}>×</Text>
//           </View>
//         </TouchableOpacity>
//       )}

//       {/* ВИДЖЕТЫ РЕШЕНИЙ */}
//       {showSolutions && (
//         <Animated.View 
//           style={[
//             styles.solutionsContainer,
//             { transform: [{ translateY: slideAnim }] }
//           ]}
//         >
//           {/* ОБЛАСТЬ ДЛЯ СВАЙПА ПОВЕРХ SCROLLVIEW КОГДА УПЕРЛИСЬ В ВЕРХ */}
//           {isScrolledToTop && (
//             <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />
//           )}
          
//           <View style={styles.swipeIndicator}>
//             <View style={styles.swipeLine} />
//           </View>
          
//           <ScrollView 
//             ref={scrollViewRef}
//             style={styles.solutionsScroll}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//             onScroll={handleScroll}
//             scrollEventThrottle={16}
//           >
//             {solutionData.methods.map((method, index) => (
//               <View key={index} style={styles.solutionWidget}>
//                 <Text style={styles.methodTitle}>{method.title}</Text>
                
//                 <View style={styles.formulasContainer}>
//                   <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                   {method.formulas.map((formula, formulaIndex) => (
//                     <Text key={formulaIndex} style={styles.formulaText}>{formula}</Text>
//                   ))}
//                 </View>
                
//                 <View style={styles.answerContainer}>
//                   <Text style={styles.answerText}>{method.answer}</Text>
//                 </View>
                
//                 <TouchableOpacity 
//                   style={styles.stepsButton}
//                   onPress={() => handleShowSteps(index)}
//                 >
//                   <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   permissionText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   permissionButton: {
//     backgroundColor: '#2E86AB',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderRadius: 10,
//   },
//   permissionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   camera: {
//     flex: 1,
//   },
//   scannerOverlay: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingBottom: 100,
//   },
//   scannerShifted: {
//     paddingBottom: 250,
//     justifyContent: 'flex-start',
//     paddingTop: 50,
//   },
//   scannerFrame: {
//     width: 300,
//     height: 200,
//     borderWidth: 2,
//     borderColor: 'white',
//     borderRadius: 12,
//     backgroundColor: 'transparent',
//   },
//   scannerText: {
//     color: 'white',
//     fontSize: 16,
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   minimalIndicator: {
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   indicatorLine: {
    
//   },
//   cameraControls: {
//     position: 'absolute',
//     bottom: 40,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   captureButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'white',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   captureButtonDisabled: {
//     opacity: 0.5,
//   },
//   captureButtonInner: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'white',
//     borderWidth: 3,
//     borderColor: 'black',
//   },
//   outsideSwipeArea: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: '40%',
//     backgroundColor: 'transparent',
//     zIndex: 999,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     zIndex: 1001,
//   },
//   closeButtonBackground: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   closeButtonText: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: -2,
//   },
//   solutionsContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '60%',
//     zIndex: 1000,
//   },
//   overlaySwipeArea: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 60, // 👈 ТОЛЬКО верхние 60px для свайпа
//     backgroundColor: 'transparent',
//     zIndex: 1002,
//   },
//   swipeIndicator: {
//     alignItems: 'center',
//     paddingTop: 8,
//     paddingBottom: 8,
//     zIndex: 1001,
//   },
//   swipeLine: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#ccc',
//     borderRadius: 2,
//   },
//   solutionsScroll: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 16,
//     paddingTop: 0,
//   },
//   solutionWidget: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 16,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     minHeight: 320,
//   },
//   methodTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 16,
//   },
//   formulasContainer: {
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   formulasLabel: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 8,
//   },
//   formulaText: {
//     fontSize: 14,
//     color: '#2c3e50',
//     fontFamily: 'monospace',
//     marginBottom: 6,
//     lineHeight: 18,
//   },
//   answerContainer: {
//     backgroundColor: '#E3F2FD',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//     borderLeftWidth: 4,
//     borderLeftColor: '#2196F3',
//   },
//   answerText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1976D2',
//     textAlign: 'left',
//   },
//   stepsButton: {
//     backgroundColor: '#2196F3',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   stepsButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!





// // 777777777777777777777777777777777777777777777777777777777777777777777777777777
// import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Animated } from 'react-native';
// import { useState, useRef } from 'react';
// import { CameraView, useCameraPermissions } from 'expo-camera';


// export default function PhysicsSolver() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef<CameraView>(null);
//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [showSolutions, setShowSolutions] = useState(false);
//   const [isScrolledToTop, setIsScrolledToTop] = useState(true);
//   const slideAnim = useRef(new Animated.Value(300)).current;
//   const scrollViewRef = useRef(null);

//   // Данные для виджетов
//   const solutionData = {
//     methods: [
//       {
//         title: "Способ 1. Через геометрию и равнодействующую силу",
//         formulas: [
//           "Закон Кулона: F = k |q₁q₂|/r²",
//           "Расстояние от центра до вершины: R = a/√3"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Рассмотрим силы...", "Шаг 2: Приравняем равнодействующую..."]
//       },
//       {
//         title: "Способ 2. Через потенциал и энергию", 
//         formulas: [
//           "Потенциал в центре: φ = 3kq/R",
//           "R = a/√3"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Найдем потенциал...", "Шаг 2: Используем условие равновесия..."]
//       }
//     ]
//   };

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       setIsTakingPhoto(true);
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
        
//         setTimeout(() => {
//           setIsTakingPhoto(false);
//           setShowSolutions(true);
//           setIsScrolledToTop(true);
          
//           Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 500,
//             useNativeDriver: true,
//           }).start();
//         }, 1500);
        
//       } catch (error) {
//         Alert.alert('Ошибка', 'Не удалось сделать фото');
//         setIsTakingPhoto(false);
//       }
//     }
//   };

//   const handleTestAPI = async () => {
//     Alert.alert('🧪', 'Тестируем DeepSeek API...');
//     const result = await testDeepSeekAPI();
    
//     if (result) {
//       Alert.alert('✅ УСПЕХ!', 'DeepSeek API работает!');
//       console.log('📝 Полный ответ:', result);
//     } else {
//       Alert.alert('❌ ОШИБКА', 'Проверь API ключ или подключение');
//     }
//   };

//   const handleShowSteps = (methodIndex: number) => {
//     Alert.alert(
//       `Шаги решения - ${solutionData.methods[methodIndex].title}`,
//       solutionData.methods[methodIndex].steps.join('\n\n')
//     );
//   };

//   const handleCloseSolutions = () => {
//     Animated.timing(slideAnim, {
//       toValue: 300,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setShowSolutions(false);
//     });
//   };

//   const handleCloseWithAlert = () => {
//     Alert.alert(
//       'Вернуться к камере?',
//       'Вы уверены, что хотите вернуться к сканированию?',
//       [
//         {
//           text: 'Отмена',
//           style: 'cancel',
//         },
//         {
//           text: 'Да',
//           onPress: handleCloseSolutions,
//         },
//       ]
//     );
//   };

//   const handleScroll = (event: any) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     setIsScrolledToTop(offsetY <= 10);
//   };

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере для сканирования задач</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить доступ к камере</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView 
//         ref={cameraRef}
//         style={styles.camera}
//         facing="back"
//       >
//         <View style={[styles.scannerOverlay, showSolutions && styles.scannerShifted]}>
//           <View style={styles.scannerFrame} />
//           <Text style={styles.scannerText}>
//             {showSolutions ? "" : "Наведите на задачу по физике"}
//           </Text>
//         </View>

//         <View style={styles.cameraControls}>
//           <TouchableOpacity 
//             style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//             onPress={takePicture}
//             disabled={isTakingPhoto}
//           >
//             <View style={styles.captureButtonInner} />
//           </TouchableOpacity>

//           {/* ТЕСТОВАЯ КНОПКА API */}
//           <TouchableOpacity 
//             style={styles.testApiButton}
//             onPress={handleTestAPI}
//           >
//             <Text style={styles.testApiText}>🧪 Тест API</Text>
//           </TouchableOpacity>
//         </View>
//       </CameraView>

//       {/* КРЕСТИК */}
//       {showSolutions && (
//         <TouchableOpacity 
//           style={styles.closeButton}
//           onPress={handleCloseWithAlert}
//         >
//           <View style={styles.closeButtonBackground}>
//             <Text style={styles.closeButtonText}>×</Text>
//           </View>
//         </TouchableOpacity>
//       )}

//       {/* ВИДЖЕТЫ РЕШЕНИЙ */}
//       {showSolutions && (
//         <Animated.View 
//           style={[
//             styles.solutionsContainer,
//             { transform: [{ translateY: slideAnim }] }
//           ]}
//         >
//           <View style={styles.swipeIndicator}>
//             <View style={styles.swipeLine} />
//           </View>
          
//           <ScrollView 
//             ref={scrollViewRef}
//             style={styles.solutionsScroll}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//             onScroll={handleScroll}
//             scrollEventThrottle={16}
//           >
//             {solutionData.methods.map((method, index) => (
//               <View key={index} style={styles.solutionWidget}>
//                 <Text style={styles.methodTitle}>{method.title}</Text>
                
//                 <View style={styles.formulasContainer}>
//                   <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                   {method.formulas.map((formula, formulaIndex) => (
//                     <Text key={formulaIndex} style={styles.formulaText}>{formula}</Text>
//                   ))}
//                 </View>
                
//                 <View style={styles.answerContainer}>
//                   <Text style={styles.answerText}>{method.answer}</Text>
//                 </View>
                
//                 <TouchableOpacity 
//                   style={styles.stepsButton}
//                   onPress={() => handleShowSteps(index)}
//                 >
//                   <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   permissionText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   permissionButton: {
//     backgroundColor: '#2E86AB',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderRadius: 10,
//   },
//   permissionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   camera: {
//     flex: 1,
//   },
//   scannerOverlay: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingBottom: 100,
//   },
//   scannerShifted: {
//     paddingBottom: 250,
//     justifyContent: 'flex-start',
//     paddingTop: 50,
//   },
//   scannerFrame: {
//     width: 300,
//     height: 200,
//     borderWidth: 2,
//     borderColor: 'white',
//     borderRadius: 12,
//     backgroundColor: 'transparent',
//   },
//   scannerText: {
//     color: 'white',
//     fontSize: 16,
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   cameraControls: {
//     position: 'absolute',
//     bottom: 40,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   captureButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'white',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   captureButtonDisabled: {
//     opacity: 0.5,
//   },
//   captureButtonInner: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'white',
//     borderWidth: 3,
//     borderColor: 'black',
//   },
//   testApiButton: {
//     backgroundColor: 'rgba(46, 134, 171, 0.9)',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   testApiText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     zIndex: 1001,
//   },
//   closeButtonBackground: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   closeButtonText: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   solutionsContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '60%',
//     zIndex: 1000,
//   },
//   swipeIndicator: {
//     alignItems: 'center',
//     paddingTop: 8,
//     paddingBottom: 8,
//   },
//   swipeLine: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#ccc',
//     borderRadius: 2,
//   },
//   solutionsScroll: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 16,
//     paddingTop: 0,
//   },
//   solutionWidget: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 16,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     minHeight: 320,
//   },
//   methodTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 16,
//   },
//   formulasContainer: {
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   formulasLabel: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 8,
//   },
//   formulaText: {
//     fontSize: 14,
//     color: '#2c3e50',
//     marginBottom: 6,
//     lineHeight: 18,
//   },
//   answerContainer: {
//     backgroundColor: '#E3F2FD',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//     borderLeftWidth: 4,
//     borderLeftColor: '#2196F3',
//   },
//   answerText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1976D2',
//     textAlign: 'left',
//   },
//   stepsButton: {
//     backgroundColor: '#2196F3',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   stepsButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });





// import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Animated, PanResponder } from 'react-native';
// import { useState, useRef } from 'react';
// import { CameraView, useCameraPermissions } from 'expo-camera';

// export default function PhysicsSolver() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef<CameraView>(null);
//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [showSolutions, setShowSolutions] = useState(false);
//   const [isScrolledToTop, setIsScrolledToTop] = useState(true);
//   const [frameSize, setFrameSize] = useState({ width: 300, height: 200 });
//   const [isResizing, setIsResizing] = useState(false);
//   const slideAnim = useRef(new Animated.Value(300)).current;
//   const scrollViewRef = useRef(null);

//   // PanResponder для свайпа
//   const swipePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, gestureState) => {
//         return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
//       },
//       onPanResponderMove: (_, gestureState) => {
//         if (gestureState.dy > 0) {
//           slideAnim.setValue(gestureState.dy);
//         }
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (gestureState.dy > 80) {
//           handleCloseWithAlert();
//         } else {
//           Animated.spring(slideAnim, {
//             toValue: 0,
//             useNativeDriver: true,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   // PanResponder для регулировки размеров рамки
//   const resizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onMoveShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: () => setIsResizing(true),
//       onPanResponderRelease: () => setIsResizing(false),
//       onPanResponderTerminate: () => setIsResizing(false),
//     })
//   ).current;

//   // Данные для виджетов
//   const solutionData = {
//     methods: [
//       {
//         title: "Способ 1. Через геометрию и равнодействующую силу",
//         formulas: [
//           "Закон Кулона: F = k |q₁q₂|/r²",
//           "Расстояние от центра до вершины: R = a/√3"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Рассмотрим силы...", "Шаг 2: Приравняем равнодействующую..."]
//       },
//       {
//         title: "Способ 2. Через потенциал и энергию", 
//         formulas: [
//           "Потенциал в центре: φ = 3kq/R",
//           "R = a/√3"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Найдем потенциал...", "Шаг 2: Используем условие равновесия..."]
//       },
//       {
//         title: "Способ 3. Через симметрию системы",
//         formulas: [
//           "Сила от каждого заряда: F₁ = F₂ = F₃",
//           "Условие равновесия: ΣF = 0"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Учитываем симметрию...", "Шаг 2: Составляем уравнение..."]
//       }
//     ]
//   };

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       setIsTakingPhoto(true);
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
        
//         setTimeout(() => {
//           setIsTakingPhoto(false);
//           setShowSolutions(true);
//           setIsScrolledToTop(true);
          
//           Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 500,
//             useNativeDriver: true,
//           }).start();
//         }, 1500);
        
//       } catch (error) {
//         Alert.alert('Ошибка', 'Не удалось сделать фото');
//         setIsTakingPhoto(false);
//       }
//     }
//   };

//   const handleResize = (side: 'top' | 'bottom' | 'left' | 'right', gestureState: any) => {
//     const MIN_SIZE = 150;
//     const MAX_WIDTH = 400;
//     const MAX_HEIGHT = 300;
    
//     setFrameSize(prev => {
//       let newWidth = prev.width;
//       let newHeight = prev.height;

//       switch(side) {
//         case 'top':
//           newHeight = Math.max(MIN_SIZE, Math.min(MAX_HEIGHT, prev.height - gestureState.dy));
//           break;
//         case 'bottom':
//           newHeight = Math.max(MIN_SIZE, Math.min(MAX_HEIGHT, prev.height + gestureState.dy));
//           break;
//         case 'left':
//           newWidth = Math.max(MIN_SIZE, Math.min(MAX_WIDTH, prev.width - gestureState.dx));
//           break;
//         case 'right':
//           newWidth = Math.max(MIN_SIZE, Math.min(MAX_WIDTH, prev.width + gestureState.dx));
//           break;
//       }

//       return { width: newWidth, height: newHeight };
//     });
//   };

//   const handleShowSteps = (methodIndex: number) => {
//     Alert.alert(
//       `Шаги решения - ${solutionData.methods[methodIndex].title}`,
//       solutionData.methods[methodIndex].steps.join('\n\n')
//     );
//   };

//   const handleCloseSolutions = () => {
//     Animated.timing(slideAnim, {
//       toValue: 300,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setShowSolutions(false);
//     });
//   };

//   const handleCloseWithAlert = () => {
//     Alert.alert(
//       'Вернуться к камере?',
//       'Вы уверены, что хотите вернуться к сканированию?',
//       [
//         {
//           text: 'Отмена',
//           style: 'cancel',
//           onPress: () => {
//             Animated.spring(slideAnim, {
//               toValue: 0,
//               useNativeDriver: true,
//             }).start();
//           },
//         },
//         {
//           text: 'Да',
//           onPress: handleCloseSolutions,
//         },
//       ]
//     );
//   };

//   // Проверка скролла до верха
//   const handleScroll = (event: any) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     setIsScrolledToTop(offsetY <= 10);
//   };

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере для сканирования задач</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить доступ к камере</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView 
//         ref={cameraRef}
//         style={styles.camera}
//         facing="back"
//       >
//         <View style={[styles.scannerOverlay, showSolutions && styles.scannerShifted]}>
//           {/* Регулируемая рамка с уголками */}
//           <View style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}>
//             {/* Уголки */}
//             <View style={styles.cornerTopLeft} />
//             <View style={styles.cornerTopRight} />
//             <View style={styles.cornerBottomLeft} />
//             <View style={styles.cornerBottomRight} />
            
//             {/* Прицел по центру */}
//             <View style={styles.crosshair}>
//               <View style={styles.crosshairVertical} />
//               <View style={styles.crosshairHorizontal} />
//             </View>
//           </View>

//           {/* Невидимые области для регулировки размера */}
//           {!isTakingPhoto && !showSolutions && (
//             <>
//               {/* Верхняя сторона */}
//               <View 
//                 style={[styles.resizeArea, styles.resizeTop]}
//                 {...resizePanResponder.panHandlers}
//                 onTouchMove={(e) => handleResize('top', e.nativeEvent)}
//               />
//               {/* Нижняя сторона */}
//               <View 
//                 style={[styles.resizeArea, styles.resizeBottom]}
//                 {...resizePanResponder.panHandlers}
//                 onTouchMove={(e) => handleResize('bottom', e.nativeEvent)}
//               />
//               {/* Левая сторона */}
//               <View 
//                 style={[styles.resizeArea, styles.resizeLeft]}
//                 {...resizePanResponder.panHandlers}
//                 onTouchMove={(e) => handleResize('left', e.nativeEvent)}
//               />
//               {/* Правая сторона */}
//               <View 
//                 style={[styles.resizeArea, styles.resizeRight]}
//                 {...resizePanResponder.panHandlers}
//                 onTouchMove={(e) => handleResize('right', e.nativeEvent)}
//               />
//             </>
//           )}

//           {showSolutions && (
//             <View style={styles.minimalIndicator}>
//               <View style={styles.indicatorLine} />
//             </View>
//           )}
//           <Text style={styles.scannerText}>
//             {showSolutions ? "" : "Наведите на задачу по физике"}
//           </Text>
//         </View>

//         <View style={styles.cameraControls}>
//           <TouchableOpacity 
//             style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//             onPress={takePicture}
//             disabled={isTakingPhoto}
//           >
//             <View style={styles.captureButtonInner} />
//           </TouchableOpacity>
//         </View>
//       </CameraView>

//       {/* ОБЛАСТЬ ДЛЯ СВАЙПА СНАРУЖИ БЕЛОГО БЛОКА */}
//       {showSolutions && (
//         <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />
//       )}

//       {/* КРЕСТИК */}
//       {showSolutions && (
//         <TouchableOpacity 
//           style={styles.closeButton}
//           onPress={handleCloseWithAlert}
//         >
//           <View style={styles.closeButtonBackground}>
//             <Text style={styles.closeButtonText}>×</Text>
//           </View>
//         </TouchableOpacity>
//       )}

//       {/* ВИДЖЕТЫ РЕШЕНИЙ */}
//       {showSolutions && (
//         <Animated.View 
//           style={[
//             styles.solutionsContainer,
//             { transform: [{ translateY: slideAnim }] }
//           ]}
//         >
//           {/* ОБЛАСТЬ ДЛЯ СВАЙПА ПОВЕРХ SCROLLVIEW КОГДА УПЕРЛИСЬ В ВЕРХ */}
//           {isScrolledToTop && (
//             <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />
//           )}
          
//           <View style={styles.swipeIndicator}>
//             <View style={styles.swipeLine} />
//           </View>
          
//           <ScrollView 
//             ref={scrollViewRef}
//             style={styles.solutionsScroll}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//             onScroll={handleScroll}
//             scrollEventThrottle={16}
//           >
//             {solutionData.methods.map((method, index) => (
//               <View key={index} style={styles.solutionWidget}>
//                 <Text style={styles.methodTitle}>{method.title}</Text>
                
//                 <View style={styles.formulasContainer}>
//                   <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                   {method.formulas.map((formula, formulaIndex) => (
//                     <Text key={formulaIndex} style={styles.formulaText}>{formula}</Text>
//                   ))}
//                 </View>
                
//                 <View style={styles.answerContainer}>
//                   <Text style={styles.answerText}>{method.answer}</Text>
//                 </View>
                
//                 <TouchableOpacity 
//                   style={styles.stepsButton}
//                   onPress={() => handleShowSteps(index)}
//                 >
//                   <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   permissionText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   permissionButton: {
//     backgroundColor: '#2E86AB',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderRadius: 10,
//   },
//   permissionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   camera: {
//     flex: 1,
//   },
//   scannerOverlay: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingBottom: 100,
//   },
//   scannerShifted: {
//     paddingBottom: 250,
//     justifyContent: 'flex-start',
//     paddingTop: 50,
//   },
//   scannerFrame: {
//     borderWidth: 0,
//     backgroundColor: 'transparent',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   // Уголки рамки
//   cornerTopLeft: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: 20,
//     height: 20,
//     borderTopWidth: 3,
//     borderLeftWidth: 3,
//     borderColor: 'white',
//   },
//   cornerTopRight: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     width: 20,
//     height: 20,
//     borderTopWidth: 3,
//     borderRightWidth: 3,
//     borderColor: 'white',
//   },
//   cornerBottomLeft: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     width: 20,
//     height: 20,
//     borderBottomWidth: 3,
//     borderLeftWidth: 3,
//     borderColor: 'white',
//   },
//   cornerBottomRight: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     width: 20,
//     height: 20,
//     borderBottomWidth: 3,
//     borderRightWidth: 3,
//     borderColor: 'white',
//   },
//   // Прицел по центру
//   crosshair: {
//     position: 'absolute',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   crosshairVertical: {
//     width: 2,
//     height: 20,
//     backgroundColor: 'white',
//   },
//   crosshairHorizontal: {
//     width: 20,
//     height: 2,
//     backgroundColor: 'white',
//     position: 'absolute',
//   },
//   // Области регулировки размера
//   resizeArea: {
//     position: 'absolute',
//     backgroundColor: 'transparent',
//   },
//   resizeTop: {
//     top: -15,
//     left: 20,
//     right: 20,
//     height: 30,
//   },
//   resizeBottom: {
//     bottom: -15,
//     left: 20,
//     right: 20,
//     height: 30,
//   },
//   resizeLeft: {
//     left: -15,
//     top: 20,
//     bottom: 20,
//     width: 30,
//   },
//   resizeRight: {
//     right: -15,
//     top: 20,
//     bottom: 20,
//     width: 30,
//   },
//   scannerText: {
//     color: 'white',
//     fontSize: 16,
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   minimalIndicator: {
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   indicatorLine: {
    
//   },
//   cameraControls: {
//     position: 'absolute',
//     bottom: 40,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   captureButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'white',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   captureButtonDisabled: {
//     opacity: 0.5,
//   },
//   captureButtonInner: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'white',
//     borderWidth: 3,
//     borderColor: 'black',
//   },
//   outsideSwipeArea: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: '40%',
//     backgroundColor: 'transparent',
//     zIndex: 999,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     zIndex: 1001,
//   },
//   closeButtonBackground: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   closeButtonText: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: -2,
//   },
//   solutionsContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '60%',
//     zIndex: 1000,
//   },
//   overlaySwipeArea: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 60,
//     backgroundColor: 'transparent',
//     zIndex: 1002,
//   },
//   swipeIndicator: {
//     alignItems: 'center',
//     paddingTop: 8,
//     paddingBottom: 8,
//     zIndex: 1001,
//   },
//   swipeLine: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#ccc',
//     borderRadius: 2,
//   },
//   solutionsScroll: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 16,
//     paddingTop: 0,
//   },
//   solutionWidget: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 16,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     minHeight: 320,
//   },
//   methodTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 16,
//   },
//   formulasContainer: {
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   formulasLabel: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 8,
//   },
//   formulaText: {
//     fontSize: 14,
//     color: '#2c3e50',
//     fontFamily: 'monospace',
//     marginBottom: 6,
//     lineHeight: 18,
//   },
//   answerContainer: {
//     backgroundColor: '#E3F2FD',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//     borderLeftWidth: 4,
//     borderLeftColor: '#2196F3',
//   },
//   answerText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1976D2',
//     textAlign: 'left',
//   },
//   stepsButton: {
//     backgroundColor: '#2196F3',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   stepsButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });




// import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Animated, PanResponder } from 'react-native';
// import { useState, useRef } from 'react';
// import { CameraView, useCameraPermissions } from 'expo-camera';

// export default function PhysicsSolver() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef<CameraView>(null);
//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [showSolutions, setShowSolutions] = useState(false);
//   const [isScrolledToTop, setIsScrolledToTop] = useState(true);
//   const [frameSize, setFrameSize] = useState({ width: 300, height: 200 });
//   const slideAnim = useRef(new Animated.Value(300)).current;
//   const scrollViewRef = useRef(null);

//   // PanResponder для свайпа
//   const swipePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, gestureState) => {
//         return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
//       },
//       onPanResponderMove: (_, gestureState) => {
//         if (gestureState.dy > 0) {
//           slideAnim.setValue(gestureState.dy);
//         }
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (gestureState.dy > 80) {
//           handleCloseWithAlert();
//         } else {
//           Animated.spring(slideAnim, {
//             toValue: 0,
//             useNativeDriver: true,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   // Функция для изменения размеров
//   const handleResize = (side: 'top' | 'bottom' | 'left' | 'right', gestureState: any) => {
//     const MIN_SIZE = 150;
//     const MAX_WIDTH = 400;
//     const MAX_HEIGHT = 300;
    
//     setFrameSize(prev => {
//       let newWidth = prev.width;
//       let newHeight = prev.height;

//       switch(side) {
//         case 'top':
//           newHeight = Math.max(MIN_SIZE, Math.min(MAX_HEIGHT, prev.height - gestureState.dy));
//           break;
//         case 'bottom':
//           newHeight = Math.max(MIN_SIZE, Math.min(MAX_HEIGHT, prev.height + gestureState.dy));
//           break;
//         case 'left':
//           newWidth = Math.max(MIN_SIZE, Math.min(MAX_WIDTH, prev.width - gestureState.dx));
//           break;
//         case 'right':
//           newWidth = Math.max(MIN_SIZE, Math.min(MAX_WIDTH, prev.width + gestureState.dx));
//           break;
//       }

//       return { width: newWidth, height: newHeight };
//     });
//   };

//   // PanResponder для каждой стороны
//   const createResizePanResponder = (side: 'top' | 'bottom' | 'left' | 'right') => 
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onMoveShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderMove: (_, gestureState) => handleResize(side, gestureState),
//     });

//   const topResizePanResponder = useRef(createResizePanResponder('top')).current;
//   const bottomResizePanResponder = useRef(createResizePanResponder('bottom')).current;
//   const leftResizePanResponder = useRef(createResizePanResponder('left')).current;
//   const rightResizePanResponder = useRef(createResizePanResponder('right')).current;

//   // Данные для виджетов
//   const solutionData = {
//     methods: [
//       {
//         title: "Способ 1. Через геометрию и равнодействующую силу",
//         formulas: [
//           "Закон Кулона: F = k |q₁q₂|/r²",
//           "Расстояние от центра до вершины: R = a/√3"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Рассмотрим силы...", "Шаг 2: Приравняем равнодействующую..."]
//       },
//       {
//         title: "Способ 2. Через потенциал и энергию", 
//         formulas: [
//           "Потенциал в центре: φ = 3kq/R",
//           "R = a/√3"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Найдем потенциал...", "Шаг 2: Используем условие равновесия..."]
//       },
//       {
//         title: "Способ 3. Через симметрию системы",
//         formulas: [
//           "Сила от каждого заряда: F₁ = F₂ = F₃",
//           "Условие равновесия: ΣF = 0"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Учитываем симметрию...", "Шаг 2: Составляем уравнение..."]
//       }
//     ]
//   };

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       setIsTakingPhoto(true);
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
        
//         setTimeout(() => {
//           setIsTakingPhoto(false);
//           setShowSolutions(true);
//           setIsScrolledToTop(true);
          
//           Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 500,
//             useNativeDriver: true,
//           }).start();
//         }, 1500);
        
//       } catch (error) {
//         Alert.alert('Ошибка', 'Не удалось сделать фото');
//         setIsTakingPhoto(false);
//       }
//     }
//   };

//   const handleShowSteps = (methodIndex: number) => {
//     Alert.alert(
//       `Шаги решения - ${solutionData.methods[methodIndex].title}`,
//       solutionData.methods[methodIndex].steps.join('\n\n')
//     );
//   };

//   const handleCloseSolutions = () => {
//     Animated.timing(slideAnim, {
//       toValue: 300,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setShowSolutions(false);
//     });
//   };

//   const handleCloseWithAlert = () => {
//     Alert.alert(
//       'Вернуться к камере?',
//       'Вы уверены, что хотите вернуться к сканированию?',
//       [
//         {
//           text: 'Отмена',
//           style: 'cancel',
//           onPress: () => {
//             Animated.spring(slideAnim, {
//               toValue: 0,
//               useNativeDriver: true,
//             }).start();
//           },
//         },
//         {
//           text: 'Да',
//           onPress: handleCloseSolutions,
//         },
//       ]
//     );
//   };

//   // Проверка скролла до верха
//   const handleScroll = (event: any) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     setIsScrolledToTop(offsetY <= 10);
//   };

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере для сканирования задач</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить доступ к камере</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView 
//         ref={cameraRef}
//         style={styles.camera}
//         facing="back"
//       >
//         <View style={[styles.scannerOverlay, showSolutions && styles.scannerShifted]}>
//           {/* Регулируемая рамка с уголками */}
//           <View style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}>
//             {/* Уголки */}
//             <View style={styles.cornerTopLeft} />
//             <View style={styles.cornerTopRight} />
//             <View style={styles.cornerBottomLeft} />
//             <View style={styles.cornerBottomRight} />
            
//             {/* Прицел по центру */}
//             <View style={styles.crosshair}>
//               <View style={styles.crosshairVertical} />
//               <View style={styles.crosshairHorizontal} />
//             </View>
//           </View>

//           {/* Области регулировки размера */}
//           {!isTakingPhoto && !showSolutions && (
//             <View style={[styles.resizeContainer, { width: frameSize.width, height: frameSize.height }]}>
//               <View style={styles.resizeTop} {...topResizePanResponder.panHandlers} />
//               <View style={styles.resizeBottom} {...bottomResizePanResponder.panHandlers} />
//               <View style={styles.resizeLeft} {...leftResizePanResponder.panHandlers} />
//               <View style={styles.resizeRight} {...rightResizePanResponder.panHandlers} />
//             </View>
//           )}

//           {showSolutions && (
//             <View style={styles.minimalIndicator}>
//               <View style={styles.indicatorLine} />
//             </View>
//           )}
//           <Text style={styles.scannerText}>
//             {showSolutions ? "" : "Наведите на задачу по физике"}
//           </Text>
//         </View>

//         <View style={styles.cameraControls}>
//           <TouchableOpacity 
//             style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//             onPress={takePicture}
//             disabled={isTakingPhoto}
//           >
//             <View style={styles.captureButtonInner} />
//           </TouchableOpacity>
//         </View>
//       </CameraView>

//       {/* ОБЛАСТЬ ДЛЯ СВАЙПА СНАРУЖИ БЕЛОГО БЛОКА */}
//       {showSolutions && (
//         <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />
//       )}

//       {/* КРЕСТИК */}
//       {showSolutions && (
//         <TouchableOpacity 
//           style={styles.closeButton}
//           onPress={handleCloseWithAlert}
//         >
//           <View style={styles.closeButtonBackground}>
//             <Text style={styles.closeButtonText}>×</Text>
//           </View>
//         </TouchableOpacity>
//       )}

//       {/* ВИДЖЕТЫ РЕШЕНИЙ */}
//       {showSolutions && (
//         <Animated.View 
//           style={[
//             styles.solutionsContainer,
//             { transform: [{ translateY: slideAnim }] }
//           ]}
//         >
//           {/* ОБЛАСТЬ ДЛЯ СВАЙПА ПОВЕРХ SCROLLVIEW КОГДА УПЕРЛИСЬ В ВЕРХ */}
//           {isScrolledToTop && (
//             <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />
//           )}
          
//           <View style={styles.swipeIndicator}>
//             <View style={styles.swipeLine} />
//           </View>
          
//           <ScrollView 
//             ref={scrollViewRef}
//             style={styles.solutionsScroll}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//             onScroll={handleScroll}
//             scrollEventThrottle={16}
//           >
//             {solutionData.methods.map((method, index) => (
//               <View key={index} style={styles.solutionWidget}>
//                 <Text style={styles.methodTitle}>{method.title}</Text>
                
//                 <View style={styles.formulasContainer}>
//                   <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                   {method.formulas.map((formula, formulaIndex) => (
//                     <Text key={formulaIndex} style={styles.formulaText}>{formula}</Text>
//                   ))}
//                 </View>
                
//                 <View style={styles.answerContainer}>
//                   <Text style={styles.answerText}>{method.answer}</Text>
//                 </View>
                
//                 <TouchableOpacity 
//                   style={styles.stepsButton}
//                   onPress={() => handleShowSteps(index)}
//                 >
//                   <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   permissionText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   permissionButton: {
//     backgroundColor: '#2E86AB',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderRadius: 10,
//   },
//   permissionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   camera: {
//     flex: 1,
//   },
//   scannerOverlay: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingBottom: 100,
//   },
//   scannerShifted: {
//     paddingBottom: 250,
//     justifyContent: 'flex-start',
//     paddingTop: 50,
//   },
//   scannerFrame: {
//     borderWidth: 0,
//     backgroundColor: 'transparent',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   // Уголки рамки
//   cornerTopLeft: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: 20,
//     height: 20,
//     borderTopWidth: 3,
//     borderLeftWidth: 3,
//     borderColor: 'white',
//   },
//   cornerTopRight: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     width: 20,
//     height: 20,
//     borderTopWidth: 3,
//     borderRightWidth: 3,
//     borderColor: 'white',
//   },
//   cornerBottomLeft: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     width: 20,
//     height: 20,
//     borderBottomWidth: 3,
//     borderLeftWidth: 3,
//     borderColor: 'white',
//   },
//   cornerBottomRight: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     width: 20,
//     height: 20,
//     borderBottomWidth: 3,
//     borderRightWidth: 3,
//     borderColor: 'white',
//   },
//   // Прицел по центру
//   crosshair: {
//     position: 'absolute',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   crosshairVertical: {
//     width: 2,
//     height: 20,
//     backgroundColor: 'white',
//   },
//   crosshairHorizontal: {
//     width: 20,
//     height: 2,
//     backgroundColor: 'white',
//     position: 'absolute',
//   },
//   // Области регулировки размера
//   resizeContainer: {
//     position: 'absolute',
//     backgroundColor: 'transparent',
//   },
//   resizeTop: {
//     position: 'absolute',
//     top: -15,
//     left: 0,
//     right: 0,
//     height: 30,
//     backgroundColor: 'transparent',
//   },
//   resizeBottom: {
//     position: 'absolute',
//     bottom: -15,
//     left: 0,
//     right: 0,
//     height: 30,
//     backgroundColor: 'transparent',
//   },
//   resizeLeft: {
//     position: 'absolute',
//     left: -15,
//     top: 0,
//     bottom: 0,
//     width: 30,
//     backgroundColor: 'transparent',
//   },
//   resizeRight: {
//     position: 'absolute',
//     right: -15,
//     top: 0,
//     bottom: 0,
//     width: 30,
//     backgroundColor: 'transparent',
//   },
//   scannerText: {
//     color: 'white',
//     fontSize: 16,
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   minimalIndicator: {
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   indicatorLine: {
    
//   },
//   cameraControls: {
//     position: 'absolute',
//     bottom: 40,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   captureButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'white',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   captureButtonDisabled: {
//     opacity: 0.5,
//   },
//   captureButtonInner: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'white',
//     borderWidth: 3,
//     borderColor: 'black',
//   },
//   outsideSwipeArea: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: '40%',
//     backgroundColor: 'transparent',
//     zIndex: 999,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     zIndex: 1001,
//   },
//   closeButtonBackground: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   closeButtonText: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: -2,
//   },
//   solutionsContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '60%',
//     zIndex: 1000,
//   },
//   overlaySwipeArea: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 60,
//     backgroundColor: 'transparent',
//     zIndex: 1002,
//   },
//   swipeIndicator: {
//     alignItems: 'center',
//     paddingTop: 8,
//     paddingBottom: 8,
//     zIndex: 1001,
//   },
//   swipeLine: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#ccc',
//     borderRadius: 2,
//   },
//   solutionsScroll: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 16,
//     paddingTop: 0,
//   },
//   solutionWidget: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 16,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     minHeight: 320,
//   },
//   methodTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 16,
//   },
//   formulasContainer: {
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   formulasLabel: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 8,
//   },
//   formulaText: {
//     fontSize: 14,
//     color: '#2c3e50',
//     fontFamily: 'monospace',
//     marginBottom: 6,
//     lineHeight: 18,
//   },
//   answerContainer: {
//     backgroundColor: '#E3F2FD',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//     borderLeftWidth: 4,
//     borderLeftColor: '#2196F3',
//   },
//   answerText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1976D2',
//     textAlign: 'left',
//   },
//   stepsButton: {
//     backgroundColor: '#2196F3',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   stepsButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });





// import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Animated, PanResponder } from 'react-native';
// import { useState, useRef } from 'react';
// import { CameraView, useCameraPermissions } from 'expo-camera';

// export default function PhysicsSolver() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef<CameraView>(null);
//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [showSolutions, setShowSolutions] = useState(false);
//   const [isScrolledToTop, setIsScrolledToTop] = useState(true);
  
//   // --- ИЗМЕНЕНИЕ 1: Состояние размеров рамки и ref для начального размера ---
//   const [frameSize, setFrameSize] = useState({ width: 300, height: 200 });
//   // Ref для хранения начальных размеров перед началом жеста (чтобы избежать дерганий)
//   const initialFrameSize = useRef({ width: 300, height: 200 });

//   const slideAnim = useRef(new Animated.Value(300)).current;
//   const scrollViewRef = useRef(null);

//   // PanResponder для свайпа шторки (ОСТАЛСЯ БЕЗ ИЗМЕНЕНИЙ)
//   const swipePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, gestureState) => {
//         return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
//       },
//       onPanResponderMove: (_, gestureState) => {
//         if (gestureState.dy > 0) {
//           slideAnim.setValue(gestureState.dy);
//         }
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (gestureState.dy > 80) {
//           handleCloseWithAlert();
//         } else {
//           Animated.spring(slideAnim, {
//             toValue: 0,
//             useNativeDriver: true,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   // --- ИЗМЕНЕНИЕ 2: НОВАЯ ЛОГИКА ИЗМЕНЕНИЯ РАЗМЕРОВ С ОГРАНИЧЕНИЯМИ ---

//   // Функция запоминания размера при начале касания
//   const handleResizeStart = () => {
//     initialFrameSize.current = { ...frameSize };
//   };

//   // Константы ограничений
//   const MIN_SIZE = 100;
//   const MAX_WIDTH = 360;  // Ограничение ширины, чтобы не вылезти за экран
//   const MAX_HEIGHT = 450; // Ограничение высоты, чтобы не налезть на кнопки

//   // PanResponder ВЕРХ
//   const topResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, gestureState) => {
//         // Тянем вверх (-dy) -> высота увеличивается. Умножаем на 2 т.к. рама по центру.
//         // Ограничиваем MIN и MAX высотой.
//         const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_SIZE, initialFrameSize.current.height - (gestureState.dy * 2)));
//         setFrameSize(prev => ({ ...prev, height: newHeight }));
//       },
//     })
//   ).current;

//   // PanResponder НИЗ
//   const bottomResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, gestureState) => {
//         // Тянем вниз (+dy) -> высота увеличивается.
//         const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_SIZE, initialFrameSize.current.height + (gestureState.dy * 2)));
//         setFrameSize(prev => ({ ...prev, height: newHeight }));
//       },
//     })
//   ).current;

//   // PanResponder ЛЕВО
//   const leftResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, gestureState) => {
//         // Тянем влево (-dx) -> ширина увеличивается.
//         const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - (gestureState.dx * 2)));
//         setFrameSize(prev => ({ ...prev, width: newWidth }));
//       },
//     })
//   ).current;

//   // PanResponder ПРАВО
//   const rightResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, gestureState) => {
//         // Тянем вправо (+dx) -> ширина увеличивается.
//         const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + (gestureState.dx * 2)));
//         setFrameSize(prev => ({ ...prev, width: newWidth }));
//       },
//     })
//   ).current;

//   // --- КОНЕЦ ИЗМЕНЕНИЙ ЛОГИКИ РАМКИ ---

//   // Данные для виджетов (БЕЗ ИЗМЕНЕНИЙ)
//   const solutionData = {
//     methods: [
//       {
//         title: "Способ 1. Через геометрию и равнодействующую силу",
//         formulas: [
//           "Закон Кулона: F = k |q₁q₂|/r²",
//           "Расстояние от центра до вершины: R = a/√3"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Рассмотрим силы...", "Шаг 2: Приравняем равнодействующую..."]
//       },
//       {
//         title: "Способ 2. Через потенциал и энергию", 
//         formulas: [
//           "Потенциал в центре: φ = 3kq/R",
//           "R = a/√3"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Найдем потенциал...", "Шаг 2: Используем условие равновесия..."]
//       },
//       {
//         title: "Способ 3. Через симметрию системы",
//         formulas: [
//           "Сила от каждого заряда: F₁ = F₂ = F₃",
//           "Условие равновесия: ΣF = 0"
//         ],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Учитываем симметрию...", "Шаг 2: Составляем уравнение..."]
//       }
//     ]
//   };

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       setIsTakingPhoto(true);
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
        
//         setTimeout(() => {
//           setIsTakingPhoto(false);
//           setShowSolutions(true);
//           setIsScrolledToTop(true);
          
//           Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 500,
//             useNativeDriver: true,
//           }).start();
//         }, 1500);
        
//       } catch (error) {
//         Alert.alert('Ошибка', 'Не удалось сделать фото');
//         setIsTakingPhoto(false);
//       }
//     }
//   };

//   const handleShowSteps = (methodIndex: number) => {
//     Alert.alert(
//       `Шаги решения - ${solutionData.methods[methodIndex].title}`,
//       solutionData.methods[methodIndex].steps.join('\n\n')
//     );
//   };

//   const handleCloseSolutions = () => {
//     Animated.timing(slideAnim, {
//       toValue: 300,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setShowSolutions(false);
//     });
//   };

//   const handleCloseWithAlert = () => {
//     Alert.alert(
//       'Вернуться к камере?',
//       'Вы уверены, что хотите вернуться к сканированию?',
//       [
//         {
//           text: 'Отмена',
//           style: 'cancel',
//           onPress: () => {
//             Animated.spring(slideAnim, {
//               toValue: 0,
//               useNativeDriver: true,
//             }).start();
//           },
//         },
//         {
//           text: 'Да',
//           onPress: handleCloseSolutions,
//         },
//       ]
//     );
//   };

//   // Проверка скролла до верха
//   const handleScroll = (event: any) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     setIsScrolledToTop(offsetY <= 10);
//   };

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере для сканирования задач</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить доступ к камере</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView 
//         ref={cameraRef}
//         style={styles.camera}
//         facing="back"
//       >
//         <View style={[styles.scannerOverlay, showSolutions && styles.scannerShifted]}>
          
//           {/* --- ИЗМЕНЕНИЕ 3: ОБНОВЛЕННАЯ СТРУКТУРА РАМКИ С ВИДИМЫМИ РУЧКАМИ --- */}
//           <View style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}>
            
//             {/* Уголки (остались прежними) */}
//             <View style={styles.cornerTopLeft} />
//             <View style={styles.cornerTopRight} />
//             <View style={styles.cornerBottomLeft} />
//             <View style={styles.cornerBottomRight} />
            
//             {/* Новые видимые элементы управления размером */}
//             {!isTakingPhoto && !showSolutions && (
//               <>
//                 {/* Верхняя грань */}
//                 <View 
//                   style={styles.resizeHandleTopArea} 
//                   {...topResizePanResponder.panHandlers}
//                 >
//                   <View style={styles.resizeHandleVisualHorizontal} />
//                 </View>

//                 {/* Нижняя грань */}
//                 <View 
//                   style={styles.resizeHandleBottomArea} 
//                   {...bottomResizePanResponder.panHandlers}
//                 >
//                   <View style={styles.resizeHandleVisualHorizontal} />
//                 </View>

//                 {/* Левая грань */}
//                 <View 
//                   style={styles.resizeHandleLeftArea} 
//                   {...leftResizePanResponder.panHandlers}
//                 >
//                   <View style={styles.resizeHandleVisualVertical} />
//                 </View>

//                 {/* Правая грань */}
//                 <View 
//                   style={styles.resizeHandleRightArea} 
//                   {...rightResizePanResponder.panHandlers}
//                 >
//                   <View style={styles.resizeHandleVisualVertical} />
//                 </View>
//               </>
//             )}

//             {/* Прицел по центру */}
//             <View style={styles.crosshair}>
//               <View style={styles.crosshairVertical} />
//               <View style={styles.crosshairHorizontal} />
//             </View>
//           </View>
//           {/* --- КОНЕЦ ИЗМЕНЕНИЙ СТРУКТУРЫ РАМКИ --- */}

//           {showSolutions && (
//             <View style={styles.minimalIndicator}>
//               <View style={styles.indicatorLine} />
//             </View>
//           )}
//           <Text style={styles.scannerText}>
//             {showSolutions ? "" : "Настройте рамку под задачу"}
//           </Text>
//         </View>

//         <View style={styles.cameraControls}>
//           <TouchableOpacity 
//             style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//             onPress={takePicture}
//             disabled={isTakingPhoto}
//           >
//             <View style={styles.captureButtonInner} />
//           </TouchableOpacity>
//         </View>
//       </CameraView>

//       {/* ОБЛАСТЬ ДЛЯ СВАЙПА СНАРУЖИ БЕЛОГО БЛОКА */}
//       {showSolutions && (
//         <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />
//       )}

//       {/* КРЕСТИК */}
//       {showSolutions && (
//         <TouchableOpacity 
//           style={styles.closeButton}
//           onPress={handleCloseWithAlert}
//         >
//           <View style={styles.closeButtonBackground}>
//             <Text style={styles.closeButtonText}>×</Text>
//           </View>
//         </TouchableOpacity>
//       )}

//       {/* ВИДЖЕТЫ РЕШЕНИЙ */}
//       {showSolutions && (
//         <Animated.View 
//           style={[
//             styles.solutionsContainer,
//             { transform: [{ translateY: slideAnim }] }
//           ]}
//         >
//           {/* ОБЛАСТЬ ДЛЯ СВАЙПА ПОВЕРХ SCROLLVIEW КОГДА УПЕРЛИСЬ В ВЕРХ */}
//           {isScrolledToTop && (
//             <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />
//           )}
          
//           <View style={styles.swipeIndicator}>
//             <View style={styles.swipeLine} />
//           </View>
          
//           <ScrollView 
//             ref={scrollViewRef}
//             style={styles.solutionsScroll}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//             onScroll={handleScroll}
//             scrollEventThrottle={16}
//           >
//             {solutionData.methods.map((method, index) => (
//               <View key={index} style={styles.solutionWidget}>
//                 <Text style={styles.methodTitle}>{method.title}</Text>
                
//                 <View style={styles.formulasContainer}>
//                   <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                   {method.formulas.map((formula, formulaIndex) => (
//                     <Text key={formulaIndex} style={styles.formulaText}>{formula}</Text>
//                   ))}
//                 </View>
                
//                 <View style={styles.answerContainer}>
//                   <Text style={styles.answerText}>{method.answer}</Text>
//                 </View>
                
//                 <TouchableOpacity 
//                   style={styles.stepsButton}
//                   onPress={() => handleShowSteps(index)}
//                 >
//                   <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   permissionText: {
//     color: 'white',
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   permissionButton: {
//     backgroundColor: '#2E86AB',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderRadius: 10,
//   },
//   permissionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   camera: {
//     flex: 1,
//   },
//   scannerOverlay: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingBottom: 100,
//   },
//   scannerShifted: {
//     paddingBottom: 250,
//     justifyContent: 'flex-start',
//     paddingTop: 50,
//   },
//   // --- ИЗМЕНЕНИЕ 4: ОБНОВЛЕННЫЕ СТИЛИ РАМКИ ---
//   scannerFrame: {
//     // Добавил тонкую рамку для визуализации границ
    
//     borderColor: 'rgba(255,255,255,0.3)', 
//     backgroundColor: 'transparent',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   // Уголки рамки (ОСТАЛИСЬ ПРЕЖНИМИ)
//   cornerTopLeft: {
//     position: 'absolute', top: -1, left: -1, width: 20, height: 20,
//     borderTopWidth: 3, borderLeftWidth: 3, borderColor: 'white',
//   },
//   cornerTopRight: {
//     position: 'absolute', top: -1, right: -1, width: 20, height: 20,
//     borderTopWidth: 3, borderRightWidth: 3, borderColor: 'white',
//   },
//   cornerBottomLeft: {
//     position: 'absolute', bottom: -1, left: -1, width: 20, height: 20,
//     borderBottomWidth: 3, borderLeftWidth: 3, borderColor: 'white',
//   },
//   cornerBottomRight: {
//     position: 'absolute', bottom: -1, right: -1, width: 20, height: 20,
//     borderBottomWidth: 3, borderRightWidth: 3, borderColor: 'white',
//   },
//   // Прицел по центру (ОСТАЛСЯ ПРЕЖНИМ)
//   crosshair: {
//     position: 'absolute', alignItems: 'center', justifyContent: 'center', opacity: 0.5
//   },
//   crosshairVertical: {
//     width: 1, height: 15, backgroundColor: 'white',
//   },
//   crosshairHorizontal: {
//     width: 15, height: 1, backgroundColor: 'white', position: 'absolute',
//   },

//   // --- НОВЫЕ СТИЛИ ДЛЯ РУЧЕК ИЗМЕНЕНИЯ РАЗМЕРА ---
//   // Зоны для касания (шире, чем видимые полоски)
//   resizeHandleTopArea: {
//     position: 'absolute', top: -20, left: 0, right: 0, height: 40,
//     justifyContent: 'center', alignItems: 'center', zIndex: 10,
//   },
//   resizeHandleBottomArea: {
//     position: 'absolute', bottom: -20, left: 0, right: 0, height: 40,
//     justifyContent: 'center', alignItems: 'center', zIndex: 10,
//   },
//   resizeHandleLeftArea: {
//     position: 'absolute', left: -20, top: 0, bottom: 0, width: 40,
//     justifyContent: 'center', alignItems: 'center', zIndex: 10,
//   },
//   resizeHandleRightArea: {
//     position: 'absolute', right: -20, top: 0, bottom: 0, width: 40,
//     justifyContent: 'center', alignItems: 'center', zIndex: 10,
//   },

//   // Визуальные полоски ("ручки")
//   resizeHandleVisualHorizontal: {
//     width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 2,
//     shadowColor: "#000", shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.5, shadowRadius: 2,
//   },
//   resizeHandleVisualVertical: {
//     width: 4, height: 40, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 2,
//     shadowColor: "#000", shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.5, shadowRadius: 2,
//   },
//   // --- КОНЕЦ НОВЫХ СТИЛЕЙ РАМКИ ---

//   scannerText: {
//     color: 'white',
//     fontSize: 16,
//     marginTop: 30,
//     textAlign: 'center',
//     textShadowColor: 'black', 
//     textShadowRadius: 5
//   },
//   minimalIndicator: {
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   indicatorLine: {
    
//   },
//   cameraControls: {
//     position: 'absolute',
//     bottom: 40,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   captureButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   captureButtonDisabled: {
//     opacity: 0.5,
//   },
//   captureButtonInner: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: 'white',
//   },
//   outsideSwipeArea: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: '40%',
//     backgroundColor: 'transparent',
//     zIndex: 999,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     zIndex: 1001,
//   },
//   closeButtonBackground: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   closeButtonText: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: -2,
//   },
//   solutionsContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '60%',
//     zIndex: 1000,
//   },
//   overlaySwipeArea: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 60,
//     backgroundColor: 'transparent',
//     zIndex: 1002,
//   },
//   swipeIndicator: {
//     alignItems: 'center',
//     paddingTop: 8,
//     paddingBottom: 8,
//     zIndex: 1001,
//   },
//   swipeLine: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#ccc',
//     borderRadius: 2,
//   },
//   solutionsScroll: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 16,
//     top: 0,
//   },
//   solutionWidget: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 16,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     minHeight: 320,
//   },
//   methodTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 16,
//   },
//   formulasContainer: {
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   formulasLabel: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#2c3e50',
//     marginBottom: 8,
//   },
//   formulaText: {
//     fontSize: 14,
//     color: '#2c3e50',
//     fontFamily: 'monospace',
//     marginBottom: 6,
//     lineHeight: 18,
//   },
//   answerContainer: {
//     backgroundColor: '#E3F2FD',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//     borderLeftWidth: 4,
//     borderLeftColor: '#2196F3',
//   },
//   answerText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1976D2',
//     textAlign: 'left',
//   },
//   stepsButton: {
//     backgroundColor: '#2196F3',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   stepsButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });



// import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Animated, PanResponder, ImageBackground } from 'react-native';
// import { useState, useRef } from 'react';
// import { CameraView, useCameraPermissions } from 'expo-camera';

// export default function PhysicsSolver() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);
//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [showSolutions, setShowSolutions] = useState(false);
//   const [isScrolledToTop, setIsScrolledToTop] = useState(true);
  
//   // Добавляем состояние для хранения сделанного фото
//   const [capturedPhoto, setCapturedPhoto] = useState(null);

//   // --- ИЗМЕНЕНИЕ 1: Состояние размеров рамки и ref для начального размера ---
//   const [frameSize, setFrameSize] = useState({ width: 300, height: 200 });
//   const initialFrameSize = useRef({ width: 300, height: 200 });

//   const slideAnim = useRef(new Animated.Value(300)).current;
//   const scrollViewRef = useRef(null);

//   // PanResponder для свайпа шторки
//   const swipePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, gestureState) => {
//         return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
//       },
//       onPanResponderMove: (_, gestureState) => {
//         if (gestureState.dy > 0) {
//           slideAnim.setValue(gestureState.dy);
//         }
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (gestureState.dy > 80) {
//           handleCloseWithAlert();
//         } else {
//           Animated.spring(slideAnim, {
//             toValue: 0,
//             useNativeDriver: true,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   // --- ЛОГИКА ИЗМЕНЕНИЯ РАЗМЕРОВ ---
//   const handleResizeStart = () => {
//     initialFrameSize.current = { ...frameSize };
//   };

//   const MIN_SIZE = 100;
//   const MAX_WIDTH = 360;
//   const MAX_HEIGHT = 450;

//   const topResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, gestureState) => {
//         const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_SIZE, initialFrameSize.current.height - (gestureState.dy * 2)));
//         setFrameSize(prev => ({ ...prev, height: newHeight }));
//       },
//     })
//   ).current;

//   const bottomResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, gestureState) => {
//         const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_SIZE, initialFrameSize.current.height + (gestureState.dy * 2)));
//         setFrameSize(prev => ({ ...prev, height: newHeight }));
//       },
//     })
//   ).current;

//   const leftResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, gestureState) => {
//         const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - (gestureState.dx * 2)));
//         setFrameSize(prev => ({ ...prev, width: newWidth }));
//       },
//     })
//   ).current;

//   const rightResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, gestureState) => {
//         const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + (gestureState.dx * 2)));
//         setFrameSize(prev => ({ ...prev, width: newWidth }));
//       },
//     })
//   ).current;

//   // Данные для виджетов
//   const solutionData = {
//     methods: [
//       {
//         title: "Способ 1. Через геометрию и равнодействующую силу",
//         formulas: ["Закон Кулона: F = k |q₁q₂|/r²", "Расстояние от центра до вершины: R = a/√3"],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Рассмотрим силы...", "Шаг 2: Приравняем равнодействующую..."]
//       },
//       {
//         title: "Способ 2. Через потенциал и энергию", 
//         formulas: ["Потенциал в центре: φ = 3kq/R", "R = a/√3"],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Найдем потенциал...", "Шаг 2: Используем условие равновесия..."]
//       },
//       {
//         title: "Способ 3. Через симметрию системы",
//         formulas: ["Сила от каждого заряда: F₁ = F₂ = F₃", "Условие равновесия: ΣF = 0"],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Учитываем симметрию...", "Шаг 2: Составляем уравнение..."]
//       }
//     ]
//   };

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       setIsTakingPhoto(true);
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
        
//         // Сохраняем фото, чтобы "заморозить" экран
//         setCapturedPhoto(photo.uri);

//         setTimeout(() => {
//           setIsTakingPhoto(false);
//           setShowSolutions(true);
//           setIsScrolledToTop(true);
          
//           Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 500,
//             useNativeDriver: true,
//           }).start();
//         }, 500); // Уменьшил задержку, так как фото уже есть
        
//       } catch (error) {
//         Alert.alert('Ошибка', 'Не удалось сделать фото');
//         setIsTakingPhoto(false);
//         setCapturedPhoto(null);
//       }
//     }
//   };

//   const handleShowSteps = (methodIndex) => {
//     Alert.alert(
//       `Шаги решения - ${solutionData.methods[methodIndex].title}`,
//       solutionData.methods[methodIndex].steps.join('\n\n')
//     );
//   };

//   const handleCloseSolutions = () => {
//     Animated.timing(slideAnim, {
//       toValue: 300,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setShowSolutions(false);
//       setCapturedPhoto(null); // Очищаем фото, возвращаем камеру
//     });
//   };

//   const handleCloseWithAlert = () => {
//     Alert.alert(
//       'Вернуться к камере?',
//       'Вы уверены, что хотите вернуться к сканированию?',
//       [
//         {
//           text: 'Отмена',
//           style: 'cancel',
//           onPress: () => {
//             Animated.spring(slideAnim, {
//               toValue: 0,
//               useNativeDriver: true,
//             }).start();
//           },
//         },
//         {
//           text: 'Да',
//           onPress: handleCloseSolutions,
//         },
//       ]
//     );
//   };

//   const handleScroll = (event) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     setIsScrolledToTop(offsetY <= 10);
//   };

//   // --- КОМПОНЕНТ РАМКИ (ВЫНЕСЕН, ЧТОБЫ НЕ ДУБЛИРОВАТЬ КОД) ---
//   const renderOverlayContent = () => (
//     <>
//       <View style={[styles.scannerOverlay, showSolutions && styles.scannerShifted]}>
//         <View style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}>
          
//           <View style={styles.cornerTopLeft} />
//           <View style={styles.cornerTopRight} />
//           <View style={styles.cornerBottomLeft} />
//           <View style={styles.cornerBottomRight} />
          
//           {/* Скрываем элементы управления размером, если фото уже сделано (capturedPhoto) */}
//           {!isTakingPhoto && !showSolutions && !capturedPhoto && (
//             <>
//               <View style={styles.resizeHandleTopArea} {...topResizePanResponder.panHandlers}>
//                 <View style={styles.resizeHandleVisualHorizontal} />
//               </View>
//               <View style={styles.resizeHandleBottomArea} {...bottomResizePanResponder.panHandlers}>
//                 <View style={styles.resizeHandleVisualHorizontal} />
//               </View>
//               <View style={styles.resizeHandleLeftArea} {...leftResizePanResponder.panHandlers}>
//                 <View style={styles.resizeHandleVisualVertical} />
//               </View>
//               <View style={styles.resizeHandleRightArea} {...rightResizePanResponder.panHandlers}>
//                 <View style={styles.resizeHandleVisualVertical} />
//               </View>
//             </>
//           )}

//           <View style={styles.crosshair}>
//             <View style={styles.crosshairVertical} />
//             <View style={styles.crosshairHorizontal} />
//           </View>
//         </View>

//         {showSolutions && (
//           <View style={styles.minimalIndicator}>
//             <View style={styles.indicatorLine} />
//           </View>
//         )}
//         <Text style={styles.scannerText}>
//           {showSolutions ? "" : "Настройте рамку под задачу"}
//         </Text>
//       </View>

//       <View style={styles.cameraControls}>
//         {/* Кнопку скрываем, если уже есть фото */}
//         {!capturedPhoto && (
//           <TouchableOpacity 
//             style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//             onPress={takePicture}
//             disabled={isTakingPhoto}
//           >
//             <View style={styles.captureButtonInner} />
//           </TouchableOpacity>
//         )}
//       </View>
//     </>
//   );

//   if (!permission) return <View />;
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* ЕСЛИ ФОТО СДЕЛАНО - ПОКАЗЫВАЕМ КАРТИНКУ, ИНАЧЕ - КАМЕРУ */}
//       {capturedPhoto ? (
//         <ImageBackground source={{ uri: capturedPhoto }} style={styles.camera}>
//           {renderOverlayContent()}
//         </ImageBackground>
//       ) : (
//         <CameraView ref={cameraRef} style={styles.camera} facing="back">
//           {renderOverlayContent()}
//         </CameraView>
//       )}

//       {showSolutions && (
//         <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />
//       )}

//       {showSolutions && (
//         <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
//           <View style={styles.closeButtonBackground}>
//             <Text style={styles.closeButtonText}>×</Text>
//           </View>
//         </TouchableOpacity>
//       )}

//       {showSolutions && (
//         <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }] }]}>
//           {isScrolledToTop && (
//             <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />
//           )}
          
//           <View style={styles.swipeIndicator}>
//             <View style={styles.swipeLine} />
//           </View>
          
//           <ScrollView 
//             ref={scrollViewRef}
//             style={styles.solutionsScroll}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//             onScroll={handleScroll}
//             scrollEventThrottle={16}
//           >
//             {solutionData.methods.map((method, index) => (
//               <View key={index} style={styles.solutionWidget}>
//                 <Text style={styles.methodTitle}>{method.title}</Text>
//                 <View style={styles.formulasContainer}>
//                   <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                   {method.formulas.map((formula, formulaIndex) => (
//                     <Text key={formulaIndex} style={styles.formulaText}>{formula}</Text>
//                   ))}
//                 </View>
//                 <View style={styles.answerContainer}>
//                   <Text style={styles.answerText}>{method.answer}</Text>
//                 </View>
//                 <TouchableOpacity style={styles.stepsButton} onPress={() => handleShowSteps(index)}>
//                   <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'black' },
//   permissionText: { color: 'white', fontSize: 18, textAlign: 'center', marginBottom: 20 },
//   permissionButton: { backgroundColor: '#2E86AB', paddingHorizontal: 20, paddingVertical: 15, borderRadius: 10 },
//   permissionButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
//   camera: { flex: 1 },
//   scannerOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
//   scannerShifted: { paddingBottom: 250, justifyContent: 'flex-start', paddingTop: 50 },
  
//   scannerFrame: {
//     borderWidth: 0, // ЛИНИИ УБРАНЫ
//     borderColor: 'rgba(255,255,255,0.3)', 
//     backgroundColor: 'transparent',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
  
//   cornerTopLeft: { position: 'absolute', top: -1, left: -1, width: 20, height: 20, borderTopWidth: 3, borderLeftWidth: 3, borderColor: 'white' },
//   cornerTopRight: { position: 'absolute', top: -1, right: -1, width: 20, height: 20, borderTopWidth: 3, borderRightWidth: 3, borderColor: 'white' },
//   cornerBottomLeft: { position: 'absolute', bottom: -1, left: -1, width: 20, height: 20, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: 'white' },
//   cornerBottomRight: { position: 'absolute', bottom: -1, right: -1, width: 20, height: 20, borderBottomWidth: 3, borderRightWidth: 3, borderColor: 'white' },
  
//   crosshair: { position: 'absolute', alignItems: 'center', justifyContent: 'center', opacity: 0.5 },
//   crosshairVertical: { width: 1, height: 15, backgroundColor: 'white' },
//   crosshairHorizontal: { width: 15, height: 1, backgroundColor: 'white', position: 'absolute' },

//   resizeHandleTopArea: { position: 'absolute', top: -20, left: 0, right: 0, height: 40, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
//   resizeHandleBottomArea: { position: 'absolute', bottom: -20, left: 0, right: 0, height: 40, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
//   resizeHandleLeftArea: { position: 'absolute', left: -20, top: 0, bottom: 0, width: 40, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
//   resizeHandleRightArea: { position: 'absolute', right: -20, top: 0, bottom: 0, width: 40, justifyContent: 'center', alignItems: 'center', zIndex: 10 },

//   resizeHandleVisualHorizontal: { width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 2, shadowColor: "#000", shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.5, shadowRadius: 2 },
//   resizeHandleVisualVertical: { width: 4, height: 40, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 2, shadowColor: "#000", shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.5, shadowRadius: 2 },

//   scannerText: { color: 'white', fontSize: 16, marginTop: 30, textAlign: 'center', textShadowColor: 'black', textShadowRadius: 5 },
//   minimalIndicator: { marginTop: 10, alignItems: 'center' },
//   indicatorLine: { },
  
//   cameraControls: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' },
//   captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
//   captureButtonDisabled: { opacity: 0.5 },
//   captureButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'white' },
  
//   outsideSwipeArea: { position: 'absolute', top: 0, left: 0, right: 0, bottom: '40%', backgroundColor: 'transparent', zIndex: 999 },
//   closeButton: { position: 'absolute', top: 50, right: 20, zIndex: 1001 },
//   closeButtonBackground: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center', justifyContent: 'center' },
//   closeButtonText: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: -2 },
  
//   solutionsContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '60%', zIndex: 1000 },
//   overlaySwipeArea: { position: 'absolute', top: 0, left: 0, right: 0, height: 60, backgroundColor: 'transparent', zIndex: 1002 },
//   swipeIndicator: { alignItems: 'center', paddingTop: 8, paddingBottom: 8, zIndex: 1001 },
//   swipeLine: { width: 40, height: 4, backgroundColor: '#ccc', borderRadius: 2 },
//   solutionsScroll: { flex: 1 },
//   scrollContent: { padding: 16, paddingTop: 0 },
  
//   solutionWidget: { backgroundColor: '#f8f9fa', borderRadius: 12, padding: 20, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, minHeight: 320 },
//   methodTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 16 },
//   formulasContainer: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 16 },
//   formulasLabel: { fontSize: 14, fontWeight: 'bold', color: '#2c3e50', marginBottom: 8 },
//   formulaText: { fontSize: 14, color: '#2c3e50', fontFamily: 'monospace', marginBottom: 6, lineHeight: 18 },
//   answerContainer: { backgroundColor: '#E3F2FD', padding: 16, borderRadius: 8, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#2196F3' },
//   answerText: { fontSize: 16, fontWeight: 'bold', color: '#1976D2', textAlign: 'left' },
//   stepsButton: { backgroundColor: '#2196F3', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center' },
//   stepsButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
// });


// import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Animated, PanResponder, ImageBackground } from 'react-native';
// import { useState, useRef } from 'react';
// import { CameraView, useCameraPermissions } from 'expo-camera';

// export default function PhysicsSolver() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);
//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [showSolutions, setShowSolutions] = useState(false);
//   const [isScrolledToTop, setIsScrolledToTop] = useState(true);
  
//   // Добавляем состояние для хранения сделанного фото
//   const [capturedPhoto, setCapturedPhoto] = useState(null);

//   // --- ИЗМЕНЕНИЕ: Состояние размеров и позиции рамки ---
//   const [frameSize, setFrameSize] = useState({ width: 300, height: 200 });
//   const [framePosition, setFramePosition] = useState({ top: 0, left: 0 });
//   const initialFrameSize = useRef({ width: 300, height: 200 });

//   const slideAnim = useRef(new Animated.Value(300)).current;
//   const scrollViewRef = useRef(null);

//   // PanResponder для свайпа шторки
//   const swipePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, gestureState) => {
//         return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
//       },
//       onPanResponderMove: (_, gestureState) => {
//         if (gestureState.dy > 0) {
//           slideAnim.setValue(gestureState.dy);
//         }
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (gestureState.dy > 80) {
//           handleCloseWithAlert();
//         } else {
//           Animated.spring(slideAnim, {
//             toValue: 0,
//             useNativeDriver: true,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   // --- ЛОГИКА ИЗМЕНЕНИЯ РАЗМЕРОВ ---
//   const handleResizeStart = () => {
//     initialFrameSize.current = { ...frameSize };
//   };

//   const MIN_SIZE = 100;
//   const MAX_WIDTH = 360;
//   const MAX_HEIGHT = 450;

//   const topResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, gestureState) => {
//         const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_SIZE, initialFrameSize.current.height - (gestureState.dy * 2)));
//         setFrameSize(prev => ({ ...prev, height: newHeight }));
//       },
//     })
//   ).current;

//   const bottomResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, gestureState) => {
//         const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_SIZE, initialFrameSize.current.height + (gestureState.dy * 2)));
//         setFrameSize(prev => ({ ...prev, height: newHeight }));
//       },
//     })
//   ).current;

//   const leftResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, gestureState) => {
//         const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - (gestureState.dx * 2)));
//         setFrameSize(prev => ({ ...prev, width: newWidth }));
//       },
//     })
//   ).current;

//   const rightResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, gestureState) => {
//         const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + (gestureState.dx * 2)));
//         setFrameSize(prev => ({ ...prev, width: newWidth }));
//       },
//     })
//   ).current;

//   // Данные для виджетов
//   const solutionData = {
//     methods: [
//       {
//         title: "Способ 1. Через геометрию и равнодействующую силу",
//         formulas: ["Закон Кулона: F = k |q₁q₂|/r²", "Расстояние от центра до вершины: R = a/√3"],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Рассмотрим силы...", "Шаг 2: Приравняем равнодействующую..."]
//       },
//       {
//         title: "Способ 2. Через потенциал и энергию", 
//         formulas: ["Потенциал в центре: φ = 3kq/R", "R = a/√3"],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Найдем потенциал...", "Шаг 2: Используем условие равновесия..."]
//       },
//       {
//         title: "Способ 3. Через симметрию системы",
//         formulas: ["Сила от каждого заряда: F₁ = F₂ = F₃", "Условие равновесия: ΣF = 0"],
//         answer: "Заряд в центре должен быть равен +0.78 мКл",
//         steps: ["Шаг 1: Учитываем симметрию...", "Шаг 2: Составляем уравнение..."]
//       }
//     ]
//   };

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       setIsTakingPhoto(true);
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
        
//         // Сохраняем фото
//         setCapturedPhoto(photo.uri);

//         // Фиксируем текущую позицию рамки
//         setFramePosition({
//           top: (styles.scannerOverlay.paddingTop || 0) + 50, // примерная позиция
//           left: (styles.scannerOverlay.paddingLeft || 0) + 20
//         });

//         setTimeout(() => {
//           setIsTakingPhoto(false);
//           setShowSolutions(true);
//           setIsScrolledToTop(true);
          
//           Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 500,
//             useNativeDriver: true,
//           }).start();
//         }, 500);
        
//       } catch (error) {
//         Alert.alert('Ошибка', 'Не удалось сделать фото');
//         setIsTakingPhoto(false);
//         setCapturedPhoto(null);
//       }
//     }
//   };

//   const handleShowSteps = (methodIndex) => {
//     Alert.alert(
//       `Шаги решения - ${solutionData.methods[methodIndex].title}`,
//       solutionData.methods[methodIndex].steps.join('\n\n')
//     );
//   };

//   const handleCloseSolutions = () => {
//     Animated.timing(slideAnim, {
//       toValue: 300,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setShowSolutions(false);
//       setCapturedPhoto(null);
//       setFramePosition({ top: 0, left: 0 }); // Сбрасываем позицию
//     });
//   };

//   const handleCloseWithAlert = () => {
//     Alert.alert(
//       'Вернуться к камере?',
//       'Вы уверены, что хотите вернуться к сканированию?',
//       [
//         {
//           text: 'Отмена',
//           style: 'cancel',
//           onPress: () => {
//             Animated.spring(slideAnim, {
//               toValue: 0,
//               useNativeDriver: true,
//             }).start();
//           },
//         },
//         {
//           text: 'Да',
//           onPress: handleCloseSolutions,
//         },
//       ]
//     );
//   };

//   const handleScroll = (event) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     setIsScrolledToTop(offsetY <= 10);
//   };

//   // --- РЕНДЕР СОДЕРЖИМОГО КАМЕРЫ ---
//   const renderCameraContent = () => (
//     <View style={styles.camera}>
//       <View style={[styles.scannerOverlay, showSolutions && styles.scannerShifted]}>
//         <View style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}>
          
//           <View style={styles.cornerTopLeft} />
//           <View style={styles.cornerTopRight} />
//           <View style={styles.cornerBottomLeft} />
//           <View style={styles.cornerBottomRight} />
          
//           {!isTakingPhoto && !showSolutions && !capturedPhoto && (
//             <>
//               <View style={styles.resizeHandleTopArea} {...topResizePanResponder.panHandlers}>
//                 <View style={styles.resizeHandleVisualHorizontal} />
//               </View>
//               <View style={styles.resizeHandleBottomArea} {...bottomResizePanResponder.panHandlers}>
//                 <View style={styles.resizeHandleVisualHorizontal} />
//               </View>
//               <View style={styles.resizeHandleLeftArea} {...leftResizePanResponder.panHandlers}>
//                 <View style={styles.resizeHandleVisualVertical} />
//               </View>
//               <View style={styles.resizeHandleRightArea} {...rightResizePanResponder.panHandlers}>
//                 <View style={styles.resizeHandleVisualVertical} />
//               </View>
//             </>
//           )}

//           <View style={styles.crosshair}>
//             <View style={styles.crosshairVertical} />
//             <View style={styles.crosshairHorizontal} />
//           </View>
//         </View>

//         {showSolutions && (
//           <View style={styles.minimalIndicator}>
//             <View style={styles.indicatorLine} />
//           </View>
//         )}
//         <Text style={styles.scannerText}>
//           {showSolutions ? "" : "Настройте рамку под задачу"}
//         </Text>
//       </View>

//       <View style={styles.cameraControls}>
//         {!capturedPhoto && (
//           <TouchableOpacity 
//             style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//             onPress={takePicture}
//             disabled={isTakingPhoto}
//           >
//             <View style={styles.captureButtonInner} />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );

//   // --- РЕНДЕР ФИКСИРОВАННОЙ РАМКИ ПОВЕРХ ИЗОБРАЖЕНИЯ ---
//   const renderFixedFrameOverlay = () => (
//     <View style={styles.fixedFrameContainer}>
//       <View style={[
//         styles.fixedFrame, 
//         { 
//           width: frameSize.width, 
//           height: frameSize.height,
//           top: framePosition.top || '25%',
//           left: framePosition.left || '50%',
//           marginLeft: -frameSize.width / 2
//         }
//       ]}>
//         <View style={styles.cornerTopLeft} />
//         <View style={styles.cornerTopRight} />
//         <View style={styles.cornerBottomLeft} />
//         <View style={styles.cornerBottomRight} />
//         <View style={styles.crosshair}>
//           <View style={styles.crosshairVertical} />
//           <View style={styles.crosshairHorizontal} />
//         </View>
//       </View>
//     </View>
//   );

//   if (!permission) return <View />;
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* ЕСЛИ ФОТО СДЕЛАНО - ПОКАЗЫВАЕМ КАРТИНКУ С ФИКСИРОВАННОЙ РАМКОЙ */}
//       {capturedPhoto ? (
//         <View style={styles.photoContainer}>
//           <ImageBackground source={{ uri: capturedPhoto }} style={styles.photoBackground}>
//             {renderFixedFrameOverlay()}
//           </ImageBackground>
//         </View>
//       ) : (
//         <CameraView ref={cameraRef} style={styles.camera} facing="back">
//           {renderCameraContent()}
//         </CameraView>
//       )}

//       {showSolutions && (
//         <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />
//       )}

//       {showSolutions && (
//         <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
//           <View style={styles.closeButtonBackground}>
//             <Text style={styles.closeButtonText}>×</Text>
//           </View>
//         </TouchableOpacity>
//       )}

//       {showSolutions && (
//         <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }] }]}>
//           {isScrolledToTop && (
//             <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />
//           )}
          
//           <View style={styles.swipeIndicator}>
//             <View style={styles.swipeLine} />
//           </View>
          
//           <ScrollView 
//             ref={scrollViewRef}
//             style={styles.solutionsScroll}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.scrollContent}
//             onScroll={handleScroll}
//             scrollEventThrottle={16}
//           >
//             {solutionData.methods.map((method, index) => (
//               <View key={index} style={styles.solutionWidget}>
//                 <Text style={styles.methodTitle}>{method.title}</Text>
//                 <View style={styles.formulasContainer}>
//                   <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                   {method.formulas.map((formula, formulaIndex) => (
//                     <Text key={formulaIndex} style={styles.formulaText}>{formula}</Text>
//                   ))}
//                 </View>
//                 <View style={styles.answerContainer}>
//                   <Text style={styles.answerText}>{method.answer}</Text>
//                 </View>
//                 <TouchableOpacity style={styles.stepsButton} onPress={() => handleShowSteps(index)}>
//                   <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'black' },
//   permissionText: { color: 'white', fontSize: 18, textAlign: 'center', marginBottom: 20 },
//   permissionButton: { backgroundColor: '#2E86AB', paddingHorizontal: 20, paddingVertical: 15, borderRadius: 10 },
//   permissionButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  
//   // Стили для камеры
//   camera: { flex: 1 },
//   photoContainer: { flex: 1 },
//   photoBackground: { flex: 1, width: '100%', height: '100%' },
  
//   // Фиксированная рамка поверх фото
//   fixedFrameContainer: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   fixedFrame: {
//     position: 'absolute',
//     borderWidth: 0,
//     backgroundColor: 'transparent',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
  
//   scannerOverlay: { 
//     flex: 1, 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     paddingBottom: 100 
//   },
//   scannerShifted: { 
//     paddingBottom: 250, 
//     justifyContent: 'flex-start', 
//     paddingTop: 50 
//   },
  
//   scannerFrame: {
//     borderWidth: 0,
//     borderColor: 'rgba(255,255,255,0.3)', 
//     backgroundColor: 'transparent',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
  
//   cornerTopLeft: { position: 'absolute', top: -1, left: -1, width: 20, height: 20, borderTopWidth: 3, borderLeftWidth: 3, borderColor: 'white' },
//   cornerTopRight: { position: 'absolute', top: -1, right: -1, width: 20, height: 20, borderTopWidth: 3, borderRightWidth: 3, borderColor: 'white' },
//   cornerBottomLeft: { position: 'absolute', bottom: -1, left: -1, width: 20, height: 20, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: 'white' },
//   cornerBottomRight: { position: 'absolute', bottom: -1, right: -1, width: 20, height: 20, borderBottomWidth: 3, borderRightWidth: 3, borderColor: 'white' },
  
//   crosshair: { position: 'absolute', alignItems: 'center', justifyContent: 'center', opacity: 0.5 },
//   crosshairVertical: { width: 1, height: 15, backgroundColor: 'white' },
//   crosshairHorizontal: { width: 15, height: 1, backgroundColor: 'white', position: 'absolute' },

//   resizeHandleTopArea: { position: 'absolute', top: -20, left: 0, right: 0, height: 40, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
//   resizeHandleBottomArea: { position: 'absolute', bottom: -20, left: 0, right: 0, height: 40, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
//   resizeHandleLeftArea: { position: 'absolute', left: -20, top: 0, bottom: 0, width: 40, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
//   resizeHandleRightArea: { position: 'absolute', right: -20, top: 0, bottom: 0, width: 40, justifyContent: 'center', alignItems: 'center', zIndex: 10 },

//   resizeHandleVisualHorizontal: { width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 2, shadowColor: "#000", shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.5, shadowRadius: 2 },
//   resizeHandleVisualVertical: { width: 4, height: 40, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 2, shadowColor: "#000", shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.5, shadowRadius: 2 },

//   scannerText: { color: 'white', fontSize: 16, marginTop: 30, textAlign: 'center', textShadowColor: 'black', textShadowRadius: 5 },
//   minimalIndicator: { marginTop: 10, alignItems: 'center' },
//   indicatorLine: { },
  
//   cameraControls: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' },
//   captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
//   captureButtonDisabled: { opacity: 0.5 },
//   captureButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'white' },
  
//   outsideSwipeArea: { position: 'absolute', top: 0, left: 0, right: 0, bottom: '40%', backgroundColor: 'transparent', zIndex: 999 },
//   closeButton: { position: 'absolute', top: 50, right: 20, zIndex: 1001 },
//   closeButtonBackground: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center', justifyContent: 'center' },
//   closeButtonText: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: -2 },
  
//   solutionsContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '60%', zIndex: 1000 },
//   overlaySwipeArea: { position: 'absolute', top: 0, left: 0, right: 0, height: 60, backgroundColor: 'transparent', zIndex: 1002 },
//   swipeIndicator: { alignItems: 'center', paddingTop: 8, paddingBottom: 8, zIndex: 1001 },
//   swipeLine: { width: 40, height: 4, backgroundColor: '#ccc', borderRadius: 2 },
//   solutionsScroll: { flex: 1 },
//   scrollContent: { padding: 16, paddingTop: 0 },
  
//   solutionWidget: { backgroundColor: '#f8f9fa', borderRadius: 12, padding: 20, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, minHeight: 320 },
//   methodTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 16 },
//   formulasContainer: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 16 },
//   formulasLabel: { fontSize: 14, fontWeight: 'bold', color: '#2c3e50', marginBottom: 8 },
//   formulaText: { fontSize: 14, color: '#2c3e50', fontFamily: 'monospace', marginBottom: 6, lineHeight: 18 },
//   answerContainer: { backgroundColor: '#E3F2FD', padding: 16, borderRadius: 8, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#2196F3' },
//   answerText: { fontSize: 16, fontWeight: 'bold', color: '#1976D2', textAlign: 'left' },
//   stepsButton: { backgroundColor: '#2196F3', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center' },
//   stepsButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
// });










// import React, { useRef, useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
//   Animated,
//   PanResponder,
//   Image,
//   ImageBackground
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";

// /*
//   PhysicsSolver — переписанный компонент.
//   Ключевые фичи:
//   - до съёмки: рамка интерактивна (resize handles)
//   - при съёмке: measure() фиксирует реальные экранные координаты рамки и контейнера камеры
//   - после съёмки: поверх ImageBackground рисуется "кроп-превью" (overflow:hidden),
//     в котором картинка сдвинута так, чтобы внутри рамки был тот самый кусок фото
//   - рамка фиксирована в тех же координатах и имеет высокий zIndex (над панелью решений)
// */

// export default function PhysicsSolver() {
//   // права на камеру
//   const [permission, requestPermission] = useCameraPermissions();

//   // refs для measure
//   const cameraContainerRef = useRef(null); // контейнер камеры (обёртка)
//   const frameRef = useRef(null); // сама рамка (в камере)
//   const photoContainerRef = useRef(null); // контейнер фото (ImageBackground)

//   // состояние камеры/фото/интерфейса
//   const cameraRef = useRef(null);
//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [capturedPhoto, setCapturedPhoto] = useState(null);
//   const [showSolutions, setShowSolutions] = useState(false);
//   const [isScrolledToTop, setIsScrolledToTop] = useState(true);

//   // slide animation для панели решений
//   const slideAnim = useRef(new Animated.Value(300)).current;

//   // размеры/позиция кадра (до фото — относительные для рисования внутри камеры;
//   // после фото — absolute экранные координаты вычисленные через measure)
//   const [frameSize, setFrameSize] = useState({ width: 300, height: 200 });
//   const initialFrameSize = useRef({ width: 300, height: 200 });

//   // когда мы замерили рамку на экране — сохраняем эти абсолютные координаты
//   // { x, y, width, height } в пикселях относительно окна
//   const [fixedFrameLayout, setFixedFrameLayout] = useState(null);

//   // layout контейнера камеры и фото (нужен для правильного сдвига картинки в "кропе")
//   const [cameraLayout, setCameraLayout] = useState(null);
//   const [photoLayout, setPhotoLayout] = useState(null); // measured when photo shown

//   // PanResponder для шторки (вытягиваем/закрываем панель решений)
//   const swipePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx),
//       onPanResponderMove: (_, g) => {
//         if (g.dy > 0) slideAnim.setValue(g.dy);
//       },
//       onPanResponderRelease: (_, g) => {
//         if (g.dy > 80) {
//           handleCloseWithAlert();
//         } else {
//           Animated.spring(slideAnim, {
//             toValue: 0,
//             useNativeDriver: true
//           }).start();
//         }
//       }
//     })
//   ).current;

//   // ---------- Resize handlers (работают только до фото) ----------
//   const handleResizeStart = () => {
//     initialFrameSize.current = { ...frameSize };
//   };

//   const MIN_SIZE = 100;
//   const MAX_WIDTH = 360;
//   const MAX_HEIGHT = 600;

//   const topResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newHeight = Math.min(
//           MAX_HEIGHT,
//           Math.max(MIN_SIZE, initialFrameSize.current.height - g.dy * 2)
//         );
//         setFrameSize((p) => ({ ...p, height: newHeight }));
//       }
//     })
//   ).current;

//   const bottomResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newHeight = Math.min(
//           MAX_HEIGHT,
//           Math.max(MIN_SIZE, initialFrameSize.current.height + g.dy * 2)
//         );
//         setFrameSize((p) => ({ ...p, height: newHeight }));
//       }
//     })
//   ).current;

//   const leftResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newWidth = Math.min(
//           MAX_WIDTH,
//           Math.max(MIN_SIZE, initialFrameSize.current.width - g.dx * 2)
//         );
//         setFrameSize((p) => ({ ...p, width: newWidth }));
//       }
//     })
//   ).current;

//   const rightResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newWidth = Math.min(
//           MAX_WIDTH,
//           Math.max(MIN_SIZE, initialFrameSize.current.width + g.dx * 2)
//         );
//         setFrameSize((p) => ({ ...p, width: newWidth }));
//       }
//     })
//   ).current;

//   // --- Данные решений (как у тебя было) ---
//   const solutionData = {
//     methods: [
//       {
//         title: "Способ 1. Через геометрию и равнодействующую силу",
//         formulas: ["Закон Кулона: F = k |q₁q₂|/r²", "R = a/√3"],
//         answer: "Заряд в центре = +0.78 мКл",
//         steps: ["Шаг 1: ...", "Шаг 2: ..."]
//       },
//       {
//         title: "Способ 2. Через потенциал",
//         formulas: ["φ = 3kq/R", "R = a/√3"],
//         answer: "Заряд в центре = +0.78 мКл",
//         steps: ["Шаг 1: ...", "Шаг 2: ..."]
//       }
//     ]
//   };

//   // ---------- СЪЁМКА: measure + фиксация рамки ----------
//   const takePicture = async () => {
//     if (!cameraRef.current) return;
//     setIsTakingPhoto(true);

//     try {
//       // перед съёмкой/или сразу после — зафиксируем layout рамки и контейнера камеры
//       // measure рамки -> получим абсолютные координаты px, py
//       if (frameRef.current && cameraContainerRef.current) {
//         frameRef.current.measure((fx, fy, width, height, px, py) => {
//           // px,py — абсолютные координаты рамки на экране
//           setFixedFrameLayout({ x: px, y: py, width, height });

//           // measure контейнера камеры (нужно потом для сдвига изображения)
//           cameraContainerRef.current.measure((cfx, cfy, cwidth, cheight, cpx, cpy) => {
//             setCameraLayout({ x: cpx, y: cpy, width: cwidth, height: cheight });
//           });
//         });
//       }

//       // сделаем фото
//       const photo = await cameraRef.current.takePictureAsync();

//       // сохраняем фото
//       setCapturedPhoto(photo.uri);

//       // запускаем шторку
//       setTimeout(() => {
//         setIsTakingPhoto(false);
//         setShowSolutions(true);
//         Animated.timing(slideAnim, {
//           toValue: 0,
//           duration: 400,
//           useNativeDriver: true
//         }).start();
//       }, 300);
//     } catch (err) {
//       Alert.alert("Ошибка", "Не удалось сделать фото");
//       setIsTakingPhoto(false);
//       setCapturedPhoto(null);
//     }
//   };

//   // Закрытие шторки с подтверждением
//   const handleCloseSolutions = () => {
//     Animated.timing(slideAnim, {
//       toValue: 300,
//       duration: 250,
//       useNativeDriver: true
//     }).start(() => {
//       setShowSolutions(false);
//       setCapturedPhoto(null);
//       setFixedFrameLayout(null);
//       setPhotoLayout(null);
//     });
//   };

//   const handleCloseWithAlert = () => {
//     Alert.alert("Вернуться?", "Вернуться к камере?", [
//       {
//         text: "Отмена",
//         style: "cancel",
//         onPress: () =>
//           Animated.spring(slideAnim, {
//             toValue: 0,
//             useNativeDriver: true
//           }).start()
//       },
//       { text: "Да", onPress: handleCloseSolutions }
//     ]);
//   };

//   const handleShowSteps = (index) => {
//     Alert.alert(solutionData.methods[index].title, solutionData.methods[index].steps.join("\n\n"));
//   };

//   const handleScroll = (e) => {
//     setIsScrolledToTop(e.nativeEvent.contentOffset.y <= 10);
//   };

//   // ---------- Helpers для рендера "кропа" ----------
//   // Если у нас есть fixedFrameLayout и photoLayout (position/size imageBackground),
//   // то мы рисуем контейнер с overflow:hidden на координатах fixedFrameLayout,
//   // а внутри рендерим Image с left/top = -(fixedFrame.x - photoLayout.x), т.е. сдвигом,
//   // чтобы в контейнере был тот самый кусок.
//   const renderFixedCropOverPhoto = () => {
//     if (!fixedFrameLayout || !photoLayout || !capturedPhoto) return null;

//     const shiftX = fixedFrameLayout.x - photoLayout.x;
//     const shiftY = fixedFrameLayout.y - photoLayout.y;

//     return (
//       <View
//         style={[
//           styles.cropWrapper,
//           {
//             top: fixedFrameLayout.y,
//             left: fixedFrameLayout.x,
//             width: fixedFrameLayout.width,
//             height: fixedFrameLayout.height,
//             zIndex: 2000 // выше панели решений
//           }
//         ]}
//         pointerEvents="none" // чтобы рамка не блокировала тапы по UI
//       >
//         {/* фон рамки (границы) */}
//         <View style={styles.frameBorder} pointerEvents="none">
//           <View style={styles.cornerTopLeft} />
//           <View style={styles.cornerTopRight} />
//           <View style={styles.cornerBottomLeft} />
//           <View style={styles.cornerBottomRight} />
//           <View style={styles.crosshair}>
//             <View style={styles.crosshairVertical} />
//             <View style={styles.crosshairHorizontal} />
//           </View>
//         </View>

//         {/* сам "кроп" - картинка сдвинута, overflow:hidden обеспечит видимость только части */}
//         <View style={styles.cropInner}>
//           <Image
//             source={{ uri: capturedPhoto }}
//             style={{
//               width: photoLayout.width,
//               height: photoLayout.height,
//               position: "absolute",
//               left: -shiftX,
//               top: -shiftY
//             }}
//             resizeMode="cover"
//           />
//         </View>
//       </View>
//     );
//   };

//   // ---------- РЕНДЕР КОНТЕНТА КАМЕРЫ (до фото) ----------
//   const renderCameraContent = () => {
//     return (
//       <View
//         style={styles.camera}
//         ref={cameraContainerRef}
//         onLayout={() => {
//           // при лайауте контейнера — измерим его размер (если понадобится)
//           cameraContainerRef.current?.measure((fx, fy, width, height, px, py) => {
//             setCameraLayout({ x: px, y: py, width, height });
//           });
//         }}
//       >
//         <View style={[styles.scannerOverlay]}>
//           {/* рамка интерактивная — оборачиваем в ref для measure */}
//           <View
//             ref={frameRef}
//             onLayout={() => {
//               // при каждом изменении layout рамки можно обновлять измерения (не строго обязательно)
//               frameRef.current?.measure((fx, fy, width, height, px, py) => {
//                 // не перезаписываем fixedFrameLayout здесь — это только для замера перед фото
//               });
//             }}
//             style={[
//               styles.scannerFrame,
//               { width: frameSize.width, height: frameSize.height, zIndex: 5 }
//             ]}
//           >
//             <View style={styles.cornerTopLeft} />
//             <View style={styles.cornerTopRight} />
//             <View style={styles.cornerBottomLeft} />
//             <View style={styles.cornerBottomRight} />

//             {!isTakingPhoto && !capturedPhoto && !showSolutions && (
//               <>
//                 <View {...topResizePanResponder.panHandlers} style={styles.resizeHandleTopArea}>
//                   <View style={styles.resizeHandleVisualHorizontal} />
//                 </View>
//                 <View {...bottomResizePanResponder.panHandlers} style={styles.resizeHandleBottomArea}>
//                   <View style={styles.resizeHandleVisualHorizontal} />
//                 </View>
//                 <View {...leftResizePanResponder.panHandlers} style={styles.resizeHandleLeftArea}>
//                   <View style={styles.resizeHandleVisualVertical} />
//                 </View>
//                 <View {...rightResizePanResponder.panHandlers} style={styles.resizeHandleRightArea}>
//                   <View style={styles.resizeHandleVisualVertical} />
//                 </View>
//               </>
//             )}

//             <View style={styles.crosshair}>
//               <View style={styles.crosshairVertical} />
//               <View style={styles.crosshairHorizontal} />
//             </View>
//           </View>

//           <Text style={styles.scannerText}>Настройте рамку под задачу</Text>
//         </View>

//         <View style={styles.cameraControls}>
//           {!capturedPhoto && (
//             <TouchableOpacity
//               style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//               onPress={takePicture}
//               disabled={isTakingPhoto}
//             >
//               <View style={styles.captureButtonInner} />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     );
//   };

//   // ---------- РЕНДЕР ПОСЛЕ ФОТО: ImageBackground с фиксированной рамкой ----------
//   const renderPhotoWithFixedFrame = () => {
//     return (
//       <View style={styles.photoContainer} ref={photoContainerRef}>
//         <ImageBackground
//           source={{ uri: capturedPhoto }}
//           style={styles.photoBackground}
//           onLayout={() => {
//             // измеряем позицию и размер ImageBackground, чтобы корректно сдвинуть картинку в "кропе"
//             photoContainerRef.current?.measure((fx, fy, width, height, px, py) => {
//               setPhotoLayout({ x: px, y: py, width, height });
//             });
//           }}
//           resizeMode="cover"
//         >
//           {/* здесь НЕ рисуем рамку как независимый компонент,
//               мы рисуем "кроп-превью" абсолютно, основываясь на fixedFrameLayout */}
//         </ImageBackground>

//         {/* после того как photoLayout и fixedFrameLayout измерены, рисуем "кроп-оверлей" */}
//         {renderFixedCropOverPhoto()}
//       </View>
//     );
//   };

//   // ---------- РЕНДЕР ОСНОВНОЙ СЦЕНЫ ----------
//   if (!permission) return <View />;

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {capturedPhoto ? (
//         renderPhotoWithFixedFrame()
//       ) : (
//         <CameraView ref={cameraRef} style={styles.camera} facing="back">
//           {renderCameraContent()}
//         </CameraView>
//       )}

//       {/* область-ловушка для свайпа шторки (сверху панели решений) */}
//       {showSolutions && <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />}

//       {/* кнопка закрыть */}
//       {showSolutions && (
//         <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
//           <View style={styles.closeButtonBackground}>
//             <Text style={styles.closeButtonText}>×</Text>
//           </View>
//         </TouchableOpacity>
//       )}

//       {/* Панель решений (анимированная) */}
//       {showSolutions && (
//         <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }] }]}>
//           {isScrolledToTop && <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />}

//           <View style={styles.swipeIndicator}>
//             <View style={styles.swipeLine} />
//           </View>

//           <ScrollView
//             style={styles.solutionsScroll}
//             contentContainerStyle={styles.scrollContent}
//             showsVerticalScrollIndicator={false}
//             onScroll={handleScroll}
//             scrollEventThrottle={16}
//           >
//             {solutionData.methods.map((m, i) => (
//               <View key={i} style={styles.solutionWidget}>
//                 <Text style={styles.methodTitle}>{m.title}</Text>

//                 <View style={styles.formulasContainer}>
//                   <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                   {m.formulas.map((f, fi) => (
//                     <Text key={fi} style={styles.formulaText}>
//                       {f}
//                     </Text>
//                   ))}
//                 </View>

//                 <View style={styles.answerContainer}>
//                   <Text style={styles.answerText}>{m.answer}</Text>
//                 </View>

//                 <TouchableOpacity style={styles.stepsButton} onPress={() => handleShowSteps(i)}>
//                   <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// /* ---------- Стили (сохранена твоя стилистика, добавлены cropWrapper и cropInner) ---------- */
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "black" },

//   permissionText: { color: "white", fontSize: 18, textAlign: "center", marginBottom: 20 },
//   permissionButton: { backgroundColor: "#2E86AB", paddingHorizontal: 20, paddingVertical: 15, borderRadius: 10 },
//   permissionButtonText: { color: "white", fontSize: 16, fontWeight: "600" },

//   camera: { flex: 1 },
//   photoContainer: { flex: 1 },
//   photoBackground: { flex: 1, width: "100%", height: "100%" },

//   // Crop wrapper: абсолютный контейнер поверх фото с overflow:hidden
//   cropWrapper: {
//     position: "absolute",
//     overflow: "visible" // рамка видима, а внутри будет cropInner с overflow:hidden
//   },
//   frameBorder: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     pointerEvents: "none"
//   },
//   cropInner: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     overflow: "hidden",
//     borderRadius: 2
//   },

//   fixedFrameContainer: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: "center",
//     alignItems: "center"
//   },
//   fixedFrame: { position: "absolute", borderWidth: 0, backgroundColor: "transparent", alignItems: "center", justifyContent: "center" },

//   scannerOverlay: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 100 },
//   scannerShifted: { paddingBottom: 250, justifyContent: "flex-start", paddingTop: 50 },

//   scannerFrame: { borderWidth: 0, borderColor: "rgba(255,255,255,0.3)", backgroundColor: "transparent", alignItems: "center", justifyContent: "center" },

//   cornerTopLeft: { position: "absolute", top: -1, left: -1, width: 20, height: 20, borderTopWidth: 3, borderLeftWidth: 3, borderColor: "white" },
//   cornerTopRight: { position: "absolute", top: -1, right: -1, width: 20, height: 20, borderTopWidth: 3, borderRightWidth: 3, borderColor: "white" },
//   cornerBottomLeft: { position: "absolute", bottom: -1, left: -1, width: 20, height: 20, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: "white" },
//   cornerBottomRight: { position: "absolute", bottom: -1, right: -1, width: 20, height: 20, borderBottomWidth: 3, borderRightWidth: 3, borderColor: "white" },

//   crosshair: { position: "absolute", alignItems: "center", justifyContent: "center", opacity: 0.5 },
//   crosshairVertical: { width: 1, height: 15, backgroundColor: "white" },
//   crosshairHorizontal: { width: 15, height: 1, backgroundColor: "white", position: "absolute" },

//   resizeHandleTopArea: { position: "absolute", top: -20, left: 0, right: 0, height: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleBottomArea: { position: "absolute", bottom: -20, left: 0, right: 0, height: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleLeftArea: { position: "absolute", left: -20, top: 0, bottom: 0, width: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleRightArea: { position: "absolute", right: -20, top: 0, bottom: 0, width: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },

//   resizeHandleVisualHorizontal: { width: 40, height: 4, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 2 },
//   resizeHandleVisualVertical: { width: 4, height: 40, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 2 },

//   scannerText: { color: "white", fontSize: 16, marginTop: 30, textAlign: "center", textShadowColor: "black", textShadowRadius: 5 },
//   minimalIndicator: { marginTop: 10, alignItems: "center" },
//   indicatorLine: {},

//   cameraControls: { position: "absolute", bottom: 40, left: 0, right: 0, alignItems: "center" },
//   captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: "rgba(255,255,255,0.3)", alignItems: "center", justifyContent: "center" },
//   captureButtonDisabled: { opacity: 0.5 },
//   captureButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: "white" },

//   outsideSwipeArea: { position: "absolute", top: 0, left: 0, right: 0, bottom: "40%", backgroundColor: "transparent", zIndex: 999 },
//   closeButton: { position: "absolute", top: 50, right: 20, zIndex: 1001 },
//   closeButtonBackground: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0, 0, 0, 0.5)", alignItems: "center", justifyContent: "center" },
//   closeButtonText: { color: "white", fontSize: 24, fontWeight: "bold", marginTop: -2 },

//   solutionsContainer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: "60%", zIndex: 1000 },
//   overlaySwipeArea: { position: "absolute", top: 0, left: 0, right: 0, height: 60, backgroundColor: "transparent", zIndex: 1002 },
//   swipeIndicator: { alignItems: "center", paddingTop: 8, paddingBottom: 8, zIndex: 1001 },
//   swipeLine: { width: 40, height: 4, backgroundColor: "#ccc", borderRadius: 2 },
//   solutionsScroll: { flex: 1 },
//   scrollContent: { padding: 16, paddingTop: 0 },

//   solutionWidget: { backgroundColor: "#f8f9fa", borderRadius: 12, padding: 20, marginBottom: 16, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
//   methodTitle: { fontSize: 16, fontWeight: "bold", color: "#2c3e50", marginBottom: 12 },
//   formulasContainer: { backgroundColor: "white", padding: 12, borderRadius: 8, marginBottom: 12 },
//   formulasLabel: { fontSize: 14, fontWeight: "bold", color: "#2c3e50", marginBottom: 8 },
//   formulaText: { fontSize: 14, color: "#2c3e50", fontFamily: "monospace", marginBottom: 6, lineHeight: 18 },
//   answerContainer: { backgroundColor: "#E3F2FD", padding: 12, borderRadius: 8, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: "#2196F3" },
//   answerText: { fontSize: 16, fontWeight: "bold", color: "#1976D2", textAlign: "left" },
//   stepsButton: { backgroundColor: "#2196F3", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: "center" },
//   stepsButtonText: { color: "white", fontSize: 14, fontWeight: "600" }
// });




// import React, { useRef, useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
//   Animated,
//   PanResponder,
//   Image,
//   ImageBackground,
//   Dimensions,
//   Platform
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";

// /*
//   PhysicsSolver — полный файл.
//   Особенности:
//   - ограничение максимальной высоты рамки исходя из доли экрана, занимаемой панелью (BOTTOM_PANEL_RATIO)
//   - рамка фиксируется при съёмке; если её координаты пересекают зону панели — автоматически корректируется вверх
//   - кроп-превью висит над панелью (zIndex высокий), pointerEvents отключены для визуального слоя
//   - resize handles ограничены по высоте
// */

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// // Консервативное значение: панель может занимать до 45% экрана
// const BOTTOM_PANEL_RATIO = 0.45;
// const TOP_AVAILABLE_RATIO = 1 - BOTTOM_PANEL_RATIO;
// const TOP_MARGIN = Platform.OS === "android" ? 24 : 34; // запас для статус-бара/заголовка (примерно)
// const MAX_FRAME_HEIGHT = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN - 8; // запас 8 px

// export default function PhysicsSolver() {
//   // camera perms
//   const [permission, requestPermission] = useCameraPermissions();

//   // refs
//   const cameraContainerRef = useRef(null);
//   const frameRef = useRef(null);
//   const photoContainerRef = useRef(null);
//   const cameraRef = useRef(null);

//   // states
//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [capturedPhoto, setCapturedPhoto] = useState(null);
//   const [showSolutions, setShowSolutions] = useState(false);
//   const [isScrolledToTop, setIsScrolledToTop] = useState(true);

//   // anim for panel (initially hidden below)
//   const initialPanelTranslate = Math.floor(SCREEN_HEIGHT * BOTTOM_PANEL_RATIO);
//   const slideAnim = useRef(new Animated.Value(initialPanelTranslate)).current;

//   // frame size (before photo) and initial
//   const [frameSize, setFrameSize] = useState({
//     width: Math.min(300, SCREEN_WIDTH - 40),
//     height: Math.min(200, MAX_FRAME_HEIGHT)
//   });
//   const initialFrameSize = useRef({ ...frameSize });

//   // fixed layout of frame in absolute screen coordinates after measure
//   const [fixedFrameLayout, setFixedFrameLayout] = useState(null);

//   // layout of photo container (ImageBackground) to compute crop offsets
//   const [photoLayout, setPhotoLayout] = useState(null);

//   // PanResponder for panel swipe
//   const swipePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx),
//       onPanResponderMove: (_, g) => {
//         if (g.dy > 0) slideAnim.setValue(g.dy);
//       },
//       onPanResponderRelease: (_, g) => {
//         if (g.dy > 80) {
//           handleCloseWithAlert();
//         } else {
//           Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
//         }
//       }
//     })
//   ).current;

//   // Resize handles (before photo) — height limited by MAX_FRAME_HEIGHT
//   const MIN_SIZE = 100;
//   const MAX_WIDTH = SCREEN_WIDTH - 40; // padding on sides
//   const MAX_HEIGHT = MAX_FRAME_HEIGHT;

//   const handleResizeStart = () => {
//     initialFrameSize.current = { ...frameSize };
//   };

//   const topResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newHeight = Math.min(
//           MAX_HEIGHT,
//           Math.max(MIN_SIZE, initialFrameSize.current.height - g.dy * 2)
//         );
//         setFrameSize((p) => ({ ...p, height: newHeight }));
//       }
//     })
//   ).current;

//   const bottomResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newHeight = Math.min(
//           MAX_HEIGHT,
//           Math.max(MIN_SIZE, initialFrameSize.current.height + g.dy * 2)
//         );
//         setFrameSize((p) => ({ ...p, height: newHeight }));
//       }
//     })
//   ).current;

//   const leftResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - g.dx * 2));
//         setFrameSize((p) => ({ ...p, width: newWidth }));
//       }
//     })
//   ).current;

//   const rightResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + g.dx * 2));
//         setFrameSize((p) => ({ ...p, width: newWidth }));
//       }
//     })
//   ).current;

//   // sample solutions data
//   const solutionData = {
//     methods: [
//       {
//         title: "Способ 1. Через геометрию и равнодействующую силу",
//         formulas: ["Закон Кулона: F = k |q₁q₂|/r²", "R = a/√3"],
//         answer: "Заряд в центре = +0.78 мКл",
//         steps: ["Шаг 1: ...", "Шаг 2: ..."]
//       },
//       {
//         title: "Способ 2. Через потенциал",
//         formulas: ["φ = 3kq/R", "R = a/√3"],
//         answer: "Заряд в центре = +0.78 мКл",
//         steps: ["Шаг 1: ...", "Шаг 2: ..."]
//       }
//     ]
//   };

//   // take picture: measure frame position and camera container, then take picture and open panel
//   const takePicture = async () => {
//     if (!cameraRef.current) return;
//     setIsTakingPhoto(true);

//     try {
//       // measure frame absolute coords before photo
//       if (frameRef.current && cameraContainerRef.current) {
//         frameRef.current.measure((fx, fy, width, height, px, py) => {
//           // px,py — absolute coords of frame
//           const measured = { x: px, y: py, width, height };

//           // if measured frame bottom falls into panel area — shift it up
//           const panelTopY = Math.floor(SCREEN_HEIGHT * (1 - BOTTOM_PANEL_RATIO)); // Y where panel begins when fully opened
//           const frameBottom = measured.y + measured.height;
//           if (frameBottom > panelTopY - 8) {
//             // shift up so bottom aligns just above panel top (with 8px margin)
//             measured.y = Math.max(TOP_MARGIN, panelTopY - 8 - measured.height);
//           }

//           setFixedFrameLayout(measured);

//           // measure photo container (camera container) - helpful for cropping coords later
//           cameraContainerRef.current.measure((cfx, cfy, cwidth, cheight, cpx, cpy) => {
//             // we store cameraLayout in photoLayout variable later when image rendered,
//             // but keeping cameraLayout could help; currently we set photoLayout on image layout
//             // (no special action required here)
//           });
//         });
//       }

//       // take photo
//       const photo = await cameraRef.current.takePictureAsync();

//       setCapturedPhoto(photo.uri);

//       // small delay then open panel
//       setTimeout(() => {
//         setIsTakingPhoto(false);
//         setShowSolutions(true);
//         Animated.timing(slideAnim, { toValue: 0, duration: 420, useNativeDriver: true }).start();
//       }, 250);
//     } catch (err) {
//       Alert.alert("Ошибка", "Не удалось сделать фото");
//       setIsTakingPhoto(false);
//       setCapturedPhoto(null);
//       setFixedFrameLayout(null);
//     }
//   };

//   const handleCloseSolutions = () => {
//     Animated.timing(slideAnim, { toValue: initialPanelTranslate, duration: 220, useNativeDriver: true }).start(() => {
//       setShowSolutions(false);
//       setCapturedPhoto(null);
//       setFixedFrameLayout(null);
//       setPhotoLayout(null);
//     });
//   };

//   const handleCloseWithAlert = () => {
//     Alert.alert("Вернуться?", "Хотите вернуться к камере?", [
//       {
//         text: "Отмена",
//         style: "cancel",
//         onPress: () => Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start()
//       },
//       { text: "Да", onPress: handleCloseSolutions }
//     ]);
//   };

//   const handleShowSteps = (index) => {
//     Alert.alert(solutionData.methods[index].title, solutionData.methods[index].steps.join("\n\n"));
//   };

//   const handleScroll = (e) => {
//     setIsScrolledToTop(e.nativeEvent.contentOffset.y <= 10);
//   };

//   // Render crop overlay above the panel. Ensure photoLayout exists and fixedFrameLayout present.
//   const renderFixedCropOverPhoto = () => {
//     if (!fixedFrameLayout || !photoLayout || !capturedPhoto) return null;

//     // compute shift of image inside crop so the crop shows the same area as frame did on camera
//     const shiftX = fixedFrameLayout.x - photoLayout.x;
//     const shiftY = fixedFrameLayout.y - photoLayout.y;

//     // Ensure crop is within top available zone (safety)
//     const panelTopY = Math.floor(SCREEN_HEIGHT * (1 - BOTTOM_PANEL_RATIO));
//     let cropTop = fixedFrameLayout.y;
//     if (cropTop + fixedFrameLayout.height > panelTopY - 8) {
//       cropTop = Math.max(TOP_MARGIN, panelTopY - 8 - fixedFrameLayout.height);
//     }

//     return (
//       <View
//         style={[
//           styles.cropWrapper,
//           {
//             top: cropTop,
//             left: fixedFrameLayout.x,
//             width: fixedFrameLayout.width,
//             height: fixedFrameLayout.height,
//             zIndex: 2001 // above solutions
//           }
//         ]}
//         pointerEvents="none"
//       >
//         <View style={styles.frameBorder} pointerEvents="none">
//           <View style={styles.cornerTopLeft} />
//           <View style={styles.cornerTopRight} />
//           <View style={styles.cornerBottomLeft} />
//           <View style={styles.cornerBottomRight} />
//           <View style={styles.crosshair}>
//             <View style={styles.crosshairVertical} />
//             <View style={styles.crosshairHorizontal} />
//           </View>
//         </View>

//         <View style={styles.cropInner}>
//           <Image
//             source={{ uri: capturedPhoto }}
//             style={{
//               width: photoLayout.width,
//               height: photoLayout.height,
//               position: "absolute",
//               left: -shiftX,
//               top: -shiftY
//             }}
//             resizeMode="cover"
//           />
//         </View>
//       </View>
//     );
//   };

//   // Camera content before photo
//   const renderCameraContent = () => {
//     return (
//       <View
//         style={styles.camera}
//         ref={cameraContainerRef}
//         onLayout={() => {
//           cameraContainerRef.current?.measure((fx, fy, width, height, px, py) => {
//             // no need to store now; photoLayout will be measured on image render
//           });
//         }}
//       >
//         <View style={styles.scannerOverlay}>
//           <View
//             ref={frameRef}
//             onLayout={() => {
//               /* optional: could update live measurements */
//             }}
//             style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}
//           >
//             <View style={styles.cornerTopLeft} />
//             <View style={styles.cornerTopRight} />
//             <View style={styles.cornerBottomLeft} />
//             <View style={styles.cornerBottomRight} />

//             {!isTakingPhoto && !capturedPhoto && !showSolutions && (
//               <>
//                 <View {...topResizePanResponder.panHandlers} style={styles.resizeHandleTopArea}>
//                   <View style={styles.resizeHandleVisualHorizontal} />
//                 </View>
//                 <View {...bottomResizePanResponder.panHandlers} style={styles.resizeHandleBottomArea}>
//                   <View style={styles.resizeHandleVisualHorizontal} />
//                 </View>
//                 <View {...leftResizePanResponder.panHandlers} style={styles.resizeHandleLeftArea}>
//                   <View style={styles.resizeHandleVisualVertical} />
//                 </View>
//                 <View {...rightResizePanResponder.panHandlers} style={styles.resizeHandleRightArea}>
//                   <View style={styles.resizeHandleVisualVertical} />
//                 </View>
//               </>
//             )}

//             <View style={styles.crosshair}>
//               <View style={styles.crosshairVertical} />
//               <View style={styles.crosshairHorizontal} />
//             </View>
//           </View>

//           <Text style={styles.scannerText}>Настройте рамку под задачу</Text>
//         </View>

//         <View style={styles.cameraControls}>
//           {!capturedPhoto && (
//             <TouchableOpacity
//               style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//               onPress={takePicture}
//               disabled={isTakingPhoto}
//             >
//               <View style={styles.captureButtonInner} />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     );
//   };

//   // After photo: render photo background and then crop overlay
//   const renderPhotoWithFixedFrame = () => {
//     return (
//       <View
//         style={styles.photoContainer}
//         ref={photoContainerRef}
//         onLayout={() => {
//           // measure photo container absolute position & size
//           photoContainerRef.current?.measure((fx, fy, width, height, px, py) => {
//             setPhotoLayout({ x: px, y: py, width, height });
//           });
//         }}
//       >
//         <ImageBackground source={{ uri: capturedPhoto }} style={styles.photoBackground} resizeMode="cover"></ImageBackground>

//         {/* crop preview above panel */}
//         {renderFixedCropOverPhoto()}
//       </View>
//     );
//   };

//   if (!permission) return <View />;
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {capturedPhoto ? (
//         renderPhotoWithFixedFrame()
//       ) : (
//         <CameraView ref={cameraRef} style={styles.camera} facing="back">
//           {renderCameraContent()}
//         </CameraView>
//       )}

//       {/* swipe overlay above content to catch drags */}
//       {showSolutions && <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />}

//       {/* close button */}
//       {showSolutions && (
//         <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
//           <View style={styles.closeButtonBackground}>
//             <Text style={styles.closeButtonText}>×</Text>
//           </View>
//         </TouchableOpacity>
//       )}

//       {/* Animated solutions panel */}
//       {showSolutions && (
//         <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }], zIndex: 2000 }]}>
//           {isScrolledToTop && <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />}

//           <View style={styles.swipeIndicator}>
//             <View style={styles.swipeLine} />
//           </View>

//           <ScrollView style={styles.solutionsScroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
//             {solutionData.methods.map((m, i) => (
//               <View key={i} style={styles.solutionWidget}>
//                 <Text style={styles.methodTitle}>{m.title}</Text>

//                 <View style={styles.formulasContainer}>
//                   <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                   {m.formulas.map((f, fi) => (
//                     <Text key={fi} style={styles.formulaText}>
//                       {f}
//                     </Text>
//                   ))}
//                 </View>

//                 <View style={styles.answerContainer}>
//                   <Text style={styles.answerText}>{m.answer}</Text>
//                 </View>

//                 <TouchableOpacity style={styles.stepsButton} onPress={() => handleShowSteps(i)}>
//                   <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "black" },

//   permissionText: { color: "white", fontSize: 18, textAlign: "center", marginBottom: 20 },
//   permissionButton: { backgroundColor: "#2E86AB", paddingHorizontal: 20, paddingVertical: 15, borderRadius: 10 },
//   permissionButtonText: { color: "white", fontSize: 16, fontWeight: "600" },

//   camera: { flex: 1 },
//   photoContainer: { flex: 1 },
//   photoBackground: { flex: 1, width: "100%", height: "100%" },

//   // crop wrapper: absolute container placed above photo; inside cropInner has overflow hidden
//   cropWrapper: {
//     position: "absolute",
//     overflow: "visible" // frame border visible; cropInner will hide overflow of image
//   },
//   frameBorder: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" },
//   cropInner: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", borderRadius: 4 },

//   scannerOverlay: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 100 },
//   scannerFrame: {
//     borderWidth: 0,
//     borderColor: "rgba(255,255,255,0.3)",
//     backgroundColor: "transparent",
//     alignItems: "center",
//     justifyContent: "center"
//   },

//   cornerTopLeft: { position: "absolute", top: -1, left: -1, width: 20, height: 20, borderTopWidth: 3, borderLeftWidth: 3, borderColor: "white" },
//   cornerTopRight: { position: "absolute", top: -1, right: -1, width: 20, height: 20, borderTopWidth: 3, borderRightWidth: 3, borderColor: "white" },
//   cornerBottomLeft: { position: "absolute", bottom: -1, left: -1, width: 20, height: 20, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: "white" },
//   cornerBottomRight: { position: "absolute", bottom: -1, right: -1, width: 20, height: 20, borderBottomWidth: 3, borderRightWidth: 3, borderColor: "white" },

//   crosshair: { position: "absolute", alignItems: "center", justifyContent: "center", opacity: 0.5 },
//   crosshairVertical: { width: 1, height: 15, backgroundColor: "white" },
//   crosshairHorizontal: { width: 15, height: 1, backgroundColor: "white", position: "absolute" },

//   resizeHandleTopArea: { position: "absolute", top: -20, left: 0, right: 0, height: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleBottomArea: { position: "absolute", bottom: -20, left: 0, right: 0, height: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleLeftArea: { position: "absolute", left: -20, top: 0, bottom: 0, width: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleRightArea: { position: "absolute", right: -20, top: 0, bottom: 0, width: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },

//   resizeHandleVisualHorizontal: { width: 40, height: 4, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 2 },
//   resizeHandleVisualVertical: { width: 4, height: 40, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 2 },

//   scannerText: { color: "white", fontSize: 16, marginTop: 30, textAlign: "center", textShadowColor: "black", textShadowRadius: 5 },

//   cameraControls: { position: "absolute", bottom: 40, left: 0, right: 0, alignItems: "center" },
//   captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: "rgba(255,255,255,0.3)", alignItems: "center", justifyContent: "center" },
//   captureButtonDisabled: { opacity: 0.5 },
//   captureButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: "white" },

//   outsideSwipeArea: { position: "absolute", top: 0, left: 0, right: 0, bottom: "40%", backgroundColor: "transparent", zIndex: 1999 },
//   closeButton: { position: "absolute", top: 50, right: 20, zIndex: 2002 },
//   closeButtonBackground: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0, 0, 0, 0.5)", alignItems: "center", justifyContent: "center" },
//   closeButtonText: { color: "white", fontSize: 24, fontWeight: "bold", marginTop: -2 },

//   solutionsContainer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: `${Math.floor(
//     BOTTOM_PANEL_RATIO * 100
//   )}%`, zIndex: 2000 },
//   overlaySwipeArea: { position: "absolute", top: 0, left: 0, right: 0, height: 60, backgroundColor: "transparent", zIndex: 2001 },
//   swipeIndicator: { alignItems: "center", paddingTop: 8, paddingBottom: 8, zIndex: 2001 },
//   swipeLine: { width: 40, height: 4, backgroundColor: "#ccc", borderRadius: 2 },
//   solutionsScroll: { flex: 1 },
//   scrollContent: { padding: 16, paddingTop: 0 },

//   solutionWidget: { backgroundColor: "#f8f9fa", borderRadius: 12, padding: 20, marginBottom: 16, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
//   methodTitle: { fontSize: 16, fontWeight: "bold", color: "#2c3e50", marginBottom: 12 },
//   formulasContainer: { backgroundColor: "white", padding: 12, borderRadius: 8, marginBottom: 12 },
//   formulasLabel: { fontSize: 14, fontWeight: "bold", color: "#2c3e50", marginBottom: 8 },
//   formulaText: { fontSize: 14, color: "#2c3e50", fontFamily: "monospace", marginBottom: 6, lineHeight: 18 },
//   answerContainer: { backgroundColor: "#E3F2FD", padding: 12, borderRadius: 8, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: "#2196F3" },
//   answerText: { fontSize: 16, fontWeight: "bold", color: "#1976D2", textAlign: "left" },
//   stepsButton: { backgroundColor: "#2196F3", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: "center" },
//   stepsButtonText: { color: "white", fontSize: 14, fontWeight: "600" }
// });






// import React, { useRef, useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
//   Animated,
//   PanResponder,
//   Image,
//   ImageBackground,
//   Dimensions,
//   Platform
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// // Консервативное значение: панель может занимать до 45% экрана
// const BOTTOM_PANEL_RATIO = 0.45;
// const TOP_AVAILABLE_RATIO = 1 - BOTTOM_PANEL_RATIO;
// const TOP_MARGIN = Platform.OS === "android" ? 24 : 34;
// const MAX_FRAME_HEIGHT = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN - 8;

// export default function PhysicsSolver() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraContainerRef = useRef(null);
//   const frameRef = useRef(null);
//   const photoContainerRef = useRef(null);
//   const cameraRef = useRef(null);

//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [capturedPhoto, setCapturedPhoto] = useState(null);
//   const [showSolutions, setShowSolutions] = useState(false);
//   const [isScrolledToTop, setIsScrolledToTop] = useState(true);

//   const initialPanelTranslate = Math.floor(SCREEN_HEIGHT * BOTTOM_PANEL_RATIO);
//   const slideAnim = useRef(new Animated.Value(initialPanelTranslate)).current;

//   const [frameSize, setFrameSize] = useState({
//     width: Math.min(300, SCREEN_WIDTH - 40),
//     height: Math.min(200, MAX_FRAME_HEIGHT)
//   });
//   const initialFrameSize = useRef({ ...frameSize });

//   const [fixedFrameLayout, setFixedFrameLayout] = useState(null);
//   const [photoLayout, setPhotoLayout] = useState(null);

//   const swipePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx),
//       onPanResponderMove: (_, g) => {
//         if (g.dy > 0) slideAnim.setValue(g.dy);
//       },
//       onPanResponderRelease: (_, g) => {
//         if (g.dy > 80) {
//           handleCloseWithAlert();
//         } else {
//           Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
//         }
//       }
//     })
//   ).current;

//   const MIN_SIZE = 100;
//   const MAX_WIDTH = SCREEN_WIDTH - 40;
//   const MAX_HEIGHT = MAX_FRAME_HEIGHT;

//   const handleResizeStart = () => {
//     initialFrameSize.current = { ...frameSize };
//   };

//   const topResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newHeight = Math.min(
//           MAX_HEIGHT,
//           Math.max(MIN_SIZE, initialFrameSize.current.height - g.dy * 2)
//         );
//         setFrameSize((p) => ({ ...p, height: newHeight }));
//       }
//     })
//   ).current;

//   const bottomResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newHeight = Math.min(
//           MAX_HEIGHT,
//           Math.max(MIN_SIZE, initialFrameSize.current.height + g.dy * 2)
//         );
//         setFrameSize((p) => ({ ...p, height: newHeight }));
//       }
//     })
//   ).current;

//   const leftResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - g.dx * 2));
//         setFrameSize((p) => ({ ...p, width: newWidth }));
//       }
//     })
//   ).current;

//   const rightResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + g.dx * 2));
//         setFrameSize((p) => ({ ...p, width: newWidth }));
//       }
//     })
//   ).current;

//   const solutionData = {
//     methods: [
//       {
//         title: "Способ 1. Через геометрию и равнодействующую силу",
//         formulas: ["Закон Кулона: F = k |q₁q₂|/r²", "R = a/√3"],
//         answer: "Заряд в центре = +0.78 мКл",
//         steps: ["Шаг 1: ...", "Шаг 2: ..."]
//       },
//       {
//         title: "Способ 2. Через потенциал",
//         formulas: ["φ = 3kq/R", "R = a/√3"],
//         answer: "Заряд в центре = +0.78 мКл",
//         steps: ["Шаг 1: ...", "Шаг 2: ..."]
//       }
//     ]
//   };

//   const takePicture = async () => {
//     if (!cameraRef.current) return;
//     setIsTakingPhoto(true);

//     try {
//       if (frameRef.current && cameraContainerRef.current) {
//         frameRef.current.measure((fx, fy, width, height, px, py) => {
//           // ВЫЧИСЛЯЕМ АВТОМАТИЧЕСКИЕ ОТСТУПЫ
//           const availableWidth = SCREEN_WIDTH;
//           const availableHeight = Math.floor(SCREEN_HEIGHT * (1 - BOTTOM_PANEL_RATIO)) - TOP_MARGIN;
          
//           // Вычисляем отступы для центрирования
//           const horizontalMargin = (availableWidth - width) / 2;
//           const verticalMargin = (availableHeight - height) / 2;
          
//           // Используем одинаковые отступы со всех сторон
//           const uniformMargin = Math.max(0, Math.min(horizontalMargin, verticalMargin));
          
//           const centeredLayout = {
//             x: uniformMargin,
//             y: TOP_MARGIN + uniformMargin,
//             width: width,
//             height: height
//           };

//           setFixedFrameLayout(centeredLayout);
//         });
//       }

//       const photo = await cameraRef.current.takePictureAsync();
//       setCapturedPhoto(photo.uri);

//       setTimeout(() => {
//         setIsTakingPhoto(false);
//         setShowSolutions(true);
//         Animated.timing(slideAnim, { toValue: 0, duration: 420, useNativeDriver: true }).start();
//       }, 250);
//     } catch (err) {
//       Alert.alert("Ошибка", "Не удалось сделать фото");
//       setIsTakingPhoto(false);
//       setCapturedPhoto(null);
//       setFixedFrameLayout(null);
//     }
//   };

//   const handleCloseSolutions = () => {
//     Animated.timing(slideAnim, { toValue: initialPanelTranslate, duration: 220, useNativeDriver: true }).start(() => {
//       setShowSolutions(false);
//       setCapturedPhoto(null);
//       setFixedFrameLayout(null);
//       setPhotoLayout(null);
//     });
//   };

//   const handleCloseWithAlert = () => {
//     Alert.alert("Вернуться?", "Хотите вернуться к камере?", [
//       {
//         text: "Отмена",
//         style: "cancel",
//         onPress: () => Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start()
//       },
//       { text: "Да", onPress: handleCloseSolutions }
//     ]);
//   };

//   const handleShowSteps = (index) => {
//     Alert.alert(solutionData.methods[index].title, solutionData.methods[index].steps.join("\n\n"));
//   };

//   const handleScroll = (e) => {
//     setIsScrolledToTop(e.nativeEvent.contentOffset.y <= 10);
//   };

//   const renderFixedCropOverPhoto = () => {
//     if (!fixedFrameLayout || !photoLayout || !capturedPhoto) return null;

//     // Вычисляем сдвиг для правильного отображения обрезанного изображения
//     const shiftX = fixedFrameLayout.x - photoLayout.x;
//     const shiftY = fixedFrameLayout.y - photoLayout.y;

//     return (
//       <View
//         style={[
//           styles.cropWrapper,
//           {
//             top: fixedFrameLayout.y,
//             left: fixedFrameLayout.x,
//             width: fixedFrameLayout.width,
//             height: fixedFrameLayout.height,
//             zIndex: 2001
//           }
//         ]}
//         pointerEvents="none"
//       >
//         <View style={styles.frameBorder} pointerEvents="none">
//           <View style={styles.cornerTopLeft} />
//           <View style={styles.cornerTopRight} />
//           <View style={styles.cornerBottomLeft} />
//           <View style={styles.cornerBottomRight} />
//           <View style={styles.crosshair}>
//             <View style={styles.crosshairVertical} />
//             <View style={styles.crosshairHorizontal} />
//           </View>
//         </View>

//         <View style={styles.cropInner}>
//           <Image
//             source={{ uri: capturedPhoto }}
//             style={{
//               width: photoLayout.width,
//               height: photoLayout.height,
//               position: "absolute",
//               left: -shiftX,
//               top: -shiftY
//             }}
//             resizeMode="cover"
//           />
//         </View>
//       </View>
//     );
//   };

//   const renderCameraContent = () => {
//     return (
//       <View
//         style={styles.camera}
//         ref={cameraContainerRef}
//       >
//         <View style={styles.scannerOverlay}>
//           <View
//             ref={frameRef}
//             style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}
//           >
//             <View style={styles.cornerTopLeft} />
//             <View style={styles.cornerTopRight} />
//             <View style={styles.cornerBottomLeft} />
//             <View style={styles.cornerBottomRight} />

//             {!isTakingPhoto && !capturedPhoto && !showSolutions && (
//               <>
//                 <View {...topResizePanResponder.panHandlers} style={styles.resizeHandleTopArea}>
//                   <View style={styles.resizeHandleVisualHorizontal} />
//                 </View>
//                 <View {...bottomResizePanResponder.panHandlers} style={styles.resizeHandleBottomArea}>
//                   <View style={styles.resizeHandleVisualHorizontal} />
//                 </View>
//                 <View {...leftResizePanResponder.panHandlers} style={styles.resizeHandleLeftArea}>
//                   <View style={styles.resizeHandleVisualVertical} />
//                 </View>
//                 <View {...rightResizePanResponder.panHandlers} style={styles.resizeHandleRightArea}>
//                   <View style={styles.resizeHandleVisualVertical} />
//                 </View>
//               </>
//             )}

//             <View style={styles.crosshair}>
//               <View style={styles.crosshairVertical} />
//               <View style={styles.crosshairHorizontal} />
//             </View>
//           </View>

//           <Text style={styles.scannerText}>Настройте рамку под задачу</Text>
//         </View>

//         <View style={styles.cameraControls}>
//           {!capturedPhoto && (
//             <TouchableOpacity
//               style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//               onPress={takePicture}
//               disabled={isTakingPhoto}
//             >
//               <View style={styles.captureButtonInner} />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     );
//   };

//   const renderPhotoWithFixedFrame = () => {
//     return (
//       <View
//         style={styles.photoContainer}
//         ref={photoContainerRef}
//         onLayout={() => {
//           photoContainerRef.current?.measure((fx, fy, width, height, px, py) => {
//             setPhotoLayout({ x: px, y: py, width, height });
//           });
//         }}
//       >
//         <ImageBackground source={{ uri: capturedPhoto }} style={styles.photoBackground} resizeMode="cover"></ImageBackground>
//         {renderFixedCropOverPhoto()}
//       </View>
//     );
//   };

//   if (!permission) return <View />;
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {capturedPhoto ? (
//         renderPhotoWithFixedFrame()
//       ) : (
//         <CameraView ref={cameraRef} style={styles.camera} facing="back">
//           {renderCameraContent()}
//         </CameraView>
//       )}

//       {showSolutions && <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />}

//       {showSolutions && (
//         <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
//           <View style={styles.closeButtonBackground}>
//             <Text style={styles.closeButtonText}>×</Text>
//           </View>
//         </TouchableOpacity>
//       )}

//       {showSolutions && (
//         <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }], zIndex: 2000 }]}>
//           {isScrolledToTop && <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />}

//           <View style={styles.swipeIndicator}>
//             <View style={styles.swipeLine} />
//           </View>

//           <ScrollView style={styles.solutionsScroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
//             {solutionData.methods.map((m, i) => (
//               <View key={i} style={styles.solutionWidget}>
//                 <Text style={styles.methodTitle}>{m.title}</Text>

//                 <View style={styles.formulasContainer}>
//                   <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                   {m.formulas.map((f, fi) => (
//                     <Text key={fi} style={styles.formulaText}>
//                       {f}
//                     </Text>
//                   ))}
//                 </View>

//                 <View style={styles.answerContainer}>
//                   <Text style={styles.answerText}>{m.answer}</Text>
//                 </View>

//                 <TouchableOpacity style={styles.stepsButton} onPress={() => handleShowSteps(i)}>
//                   <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "black" },

//   permissionText: { color: "white", fontSize: 18, textAlign: "center", marginBottom: 20 },
//   permissionButton: { backgroundColor: "#2E86AB", paddingHorizontal: 20, paddingVertical: 15, borderRadius: 10 },
//   permissionButtonText: { color: "white", fontSize: 16, fontWeight: "600" },

//   camera: { flex: 1 },
//   photoContainer: { flex: 1 },
//   photoBackground: { flex: 1, width: "100%", height: "100%" },

//   cropWrapper: {
//     position: "absolute",
//     overflow: "visible"
//   },
//   frameBorder: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" },
//   cropInner: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", borderRadius: 4 },

//   scannerOverlay: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 100 },
//   scannerFrame: {
//     borderWidth: 0,
//     borderColor: "rgba(255,255,255,0.3)",
//     backgroundColor: "transparent",
//     alignItems: "center",
//     justifyContent: "center"
//   },

//   cornerTopLeft: { position: "absolute", top: -1, left: -1, width: 20, height: 20, borderTopWidth: 3, borderLeftWidth: 3, borderColor: "white" },
//   cornerTopRight: { position: "absolute", top: -1, right: -1, width: 20, height: 20, borderTopWidth: 3, borderRightWidth: 3, borderColor: "white" },
//   cornerBottomLeft: { position: "absolute", bottom: -1, left: -1, width: 20, height: 20, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: "white" },
//   cornerBottomRight: { position: "absolute", bottom: -1, right: -1, width: 20, height: 20, borderBottomWidth: 3, borderRightWidth: 3, borderColor: "white" },

//   crosshair: { position: "absolute", alignItems: "center", justifyContent: "center", opacity: 0.5 },
//   crosshairVertical: { width: 1, height: 15, backgroundColor: "white" },
//   crosshairHorizontal: { width: 15, height: 1, backgroundColor: "white", position: "absolute" },

//   resizeHandleTopArea: { position: "absolute", top: -20, left: 0, right: 0, height: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleBottomArea: { position: "absolute", bottom: -20, left: 0, right: 0, height: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleLeftArea: { position: "absolute", left: -20, top: 0, bottom: 0, width: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleRightArea: { position: "absolute", right: -20, top: 0, bottom: 0, width: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },

//   resizeHandleVisualHorizontal: { width: 40, height: 4, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 2 },
//   resizeHandleVisualVertical: { width: 4, height: 40, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 2 },

//   scannerText: { color: "white", fontSize: 16, marginTop: 30, textAlign: "center", textShadowColor: "black", textShadowRadius: 5 },

//   cameraControls: { position: "absolute", bottom: 40, left: 0, right: 0, alignItems: "center" },
//   captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: "rgba(255,255,255,0.3)", alignItems: "center", justifyContent: "center" },
//   captureButtonDisabled: { opacity: 0.5 },
//   captureButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: "white" },

//   outsideSwipeArea: { position: "absolute", top: 0, left: 0, right: 0, bottom: "40%", backgroundColor: "transparent", zIndex: 1999 },
//   closeButton: { position: "absolute", top: 50, right: 20, zIndex: 2002 },
//   closeButtonBackground: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0, 0, 0, 0.5)", alignItems: "center", justifyContent: "center" },
//   closeButtonText: { color: "white", fontSize: 24, fontWeight: "bold", marginTop: -2 },

//   solutionsContainer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: `${Math.floor(
//     BOTTOM_PANEL_RATIO * 100
//   )}%`, zIndex: 2000 },
//   overlaySwipeArea: { position: "absolute", top: 0, left: 0, right: 0, height: 60, backgroundColor: "transparent", zIndex: 2001 },
//   swipeIndicator: { alignItems: "center", paddingTop: 8, paddingBottom: 8, zIndex: 2001 },
//   swipeLine: { width: 40, height: 4, backgroundColor: "#ccc", borderRadius: 2 },
//   solutionsScroll: { flex: 1 },
//   scrollContent: { padding: 16, paddingTop: 0 },

//   solutionWidget: { backgroundColor: "#f8f9fa", borderRadius: 12, padding: 20, marginBottom: 16, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
//   methodTitle: { fontSize: 16, fontWeight: "bold", color: "#2c3e50", marginBottom: 12 },
//   formulasContainer: { backgroundColor: "white", padding: 12, borderRadius: 8, marginBottom: 12 },
//   formulasLabel: { fontSize: 14, fontWeight: "bold", color: "#2c3e50", marginBottom: 8 },
//   formulaText: { fontSize: 14, color: "#2c3e50", fontFamily: "monospace", marginBottom: 6, lineHeight: 18 },
//   answerContainer: { backgroundColor: "#E3F2FD", padding: 12, borderRadius: 8, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: "#2196F3" },
//   answerText: { fontSize: 16, fontWeight: "bold", color: "#1976D2", textAlign: "left" },
//   stepsButton: { backgroundColor: "#2196F3", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: "center" },
//   stepsButtonText: { color: "white", fontSize: 14, fontWeight: "600" }
// });



// import React, { useRef, useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
//   Animated,
//   PanResponder,
//   Image,
//   ImageBackground,
//   Dimensions,
//   Platform
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// const BOTTOM_PANEL_RATIO = 0.45;
// const TOP_AVAILABLE_RATIO = 1 - BOTTOM_PANEL_RATIO;
// const TOP_MARGIN = Platform.OS === "android" ? 24 : 34;
// const MAX_FRAME_HEIGHT = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN - 8;

// export default function PhysicsSolver() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraContainerRef = useRef(null);
//   const frameRef = useRef(null);
//   const photoContainerRef = useRef(null);
//   const cameraRef = useRef(null);

//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [capturedPhoto, setCapturedPhoto] = useState(null);
//   const [showSolutions, setShowSolutions] = useState(false);
//   const [isScrolledToTop, setIsScrolledToTop] = useState(true);

//   const initialPanelTranslate = Math.floor(SCREEN_HEIGHT * BOTTOM_PANEL_RATIO);
//   const slideAnim = useRef(new Animated.Value(initialPanelTranslate)).current;

//   const [frameSize, setFrameSize] = useState({
//     width: Math.min(300, SCREEN_WIDTH - 40),
//     height: Math.min(200, MAX_FRAME_HEIGHT)
//   });
//   const initialFrameSize = useRef({ ...frameSize });

//   const [fixedFrameLayout, setFixedFrameLayout] = useState(null);
//   const [photoLayout, setPhotoLayout] = useState(null);

//   const swipePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx),
//       onPanResponderMove: (_, g) => {
//         if (g.dy > 0) slideAnim.setValue(g.dy);
//       },
//       onPanResponderRelease: (_, g) => {
//         if (g.dy > 80) {
//           handleCloseWithAlert();
//         } else {
//           Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
//         }
//       }
//     })
//   ).current;

//   const MIN_SIZE = 100;
//   const MAX_WIDTH = SCREEN_WIDTH - 40;
//   const MAX_HEIGHT = MAX_FRAME_HEIGHT;

//   const handleResizeStart = () => {
//     initialFrameSize.current = { ...frameSize };
//   };

//   const topResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newHeight = Math.min(
//           MAX_HEIGHT,
//           Math.max(MIN_SIZE, initialFrameSize.current.height - g.dy * 2)
//         );
//         setFrameSize((p) => ({ ...p, height: newHeight }));
//       }
//     })
//   ).current;

//   const bottomResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newHeight = Math.min(
//           MAX_HEIGHT,
//           Math.max(MIN_SIZE, initialFrameSize.current.height + g.dy * 2)
//         );
//         setFrameSize((p) => ({ ...p, height: newHeight }));
//       }
//     })
//   ).current;

//   const leftResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - g.dx * 2));
//         setFrameSize((p) => ({ ...p, width: newWidth }));
//       }
//     })
//   ).current;

//   const rightResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + g.dx * 2));
//         setFrameSize((p) => ({ ...p, width: newWidth }));
//       }
//     })
//   ).current;

//   const solutionData = {
//     methods: [
//       {
//         title: "Способ 1. Через геометрию и равнодействующую силу",
//         formulas: ["Закон Кулона: F = k |q₁q₂|/r²", "R = a/√3"],
//         answer: "Заряд в центре = +0.78 мКл",
//         steps: ["Шаг 1: ...", "Шаг 2: ..."]
//       },
//       {
//         title: "Способ 2. Через потенциал",
//         formulas: ["φ = 3kq/R", "R = a/√3"],
//         answer: "Заряд в центре = +0.78 мКл",
//         steps: ["Шаг 1: ...", "Шаг 2: ..."]
//       }
//     ]
//   };

//   const takePicture = async () => {
//     if (!cameraRef.current) return;
//     setIsTakingPhoto(true);

//     try {
//       if (frameRef.current && cameraContainerRef.current) {
//         frameRef.current.measure((fx, fy, width, height, px, py) => {
//           // ВЫЧИСЛЯЕМ ЦЕНТРИРОВАНИЕ МЕЖДУ ВЕРХОМ И ВИДЖЕТАМИ
//           const availableWidth = SCREEN_WIDTH;
//           const availableHeight = Math.floor(SCREEN_HEIGHT * (1 - BOTTOM_PANEL_RATIO)) - TOP_MARGIN;
          
//           // Центрируем по вертикали между верхним краем и виджетами
//           const horizontalMargin = (availableWidth - width) / 2;
//           const verticalMargin = (availableHeight - height) / 2;
          
//           // Используем одинаковые отступы для симметрии
//           const uniformMargin = Math.max(0, Math.min(horizontalMargin, verticalMargin));
          
//           const centeredLayout = {
//             x: uniformMargin,
//             y: TOP_MARGIN + (availableHeight - height) / 2, // Центрируем по вертикали
//             width: width,
//             height: height
//           };

//           setFixedFrameLayout(centeredLayout);
//         });
//       }

//       const photo = await cameraRef.current.takePictureAsync();
//       setCapturedPhoto(photo.uri);

//       setTimeout(() => {
//         setIsTakingPhoto(false);
//         setShowSolutions(true);
//         Animated.timing(slideAnim, { toValue: 0, duration: 420, useNativeDriver: true }).start();
//       }, 250);
//     } catch (err) {
//       Alert.alert("Ошибка", "Не удалось сделать фото");
//       setIsTakingPhoto(false);
//       setCapturedPhoto(null);
//       setFixedFrameLayout(null);
//     }
//   };

//   const handleCloseSolutions = () => {
//     Animated.timing(slideAnim, { toValue: initialPanelTranslate, duration: 220, useNativeDriver: true }).start(() => {
//       setShowSolutions(false);
//       setCapturedPhoto(null);
//       setFixedFrameLayout(null);
//       setPhotoLayout(null);
//     });
//   };

//   const handleCloseWithAlert = () => {
//     Alert.alert("Вернуться?", "Хотите вернуться к камере?", [
//       {
//         text: "Отмена",
//         style: "cancel",
//         onPress: () => Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start()
//       },
//       { text: "Да", onPress: handleCloseSolutions }
//     ]);
//   };

//   const handleShowSteps = (index) => {
//     Alert.alert(solutionData.methods[index].title, solutionData.methods[index].steps.join("\n\n"));
//   };

//   const handleScroll = (e) => {
//     setIsScrolledToTop(e.nativeEvent.contentOffset.y <= 10);
//   };

//   const renderFixedCropOverPhoto = () => {
//     if (!fixedFrameLayout || !photoLayout || !capturedPhoto) return null;

//     const shiftX = fixedFrameLayout.x - photoLayout.x;
//     const shiftY = fixedFrameLayout.y - photoLayout.y;

//     return (
//       <View
//         style={[
//           styles.cropWrapper,
//           {
//             top: fixedFrameLayout.y,
//             left: fixedFrameLayout.x,
//             width: fixedFrameLayout.width,
//             height: fixedFrameLayout.height,
//             zIndex: 2001
//           }
//         ]}
//         pointerEvents="none"
//       >
//         <View style={styles.frameBorder} pointerEvents="none">
//           <View style={styles.cornerTopLeft} />
//           <View style={styles.cornerTopRight} />
//           <View style={styles.cornerBottomLeft} />
//           <View style={styles.cornerBottomRight} />
//           <View style={styles.crosshair}>
//             <View style={styles.crosshairVertical} />
//             <View style={styles.crosshairHorizontal} />
//           </View>
//         </View>

//         <View style={styles.cropInner}>
//           <Image
//             source={{ uri: capturedPhoto }}
//             style={{
//               width: photoLayout.width,
//               height: photoLayout.height,
//               position: "absolute",
//               left: -shiftX,
//               top: -shiftY
//             }}
//             resizeMode="cover"
//           />
//         </View>
//       </View>
//     );
//   };

//   const renderCameraContent = () => {
//     return (
//       <View
//         style={styles.camera}
//         ref={cameraContainerRef}
//       >
//         <View style={styles.scannerOverlay}>
//           <View
//             ref={frameRef}
//             style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}
//           >
//             <View style={styles.cornerTopLeft} />
//             <View style={styles.cornerTopRight} />
//             <View style={styles.cornerBottomLeft} />
//             <View style={styles.cornerBottomRight} />

//             {!isTakingPhoto && !capturedPhoto && !showSolutions && (
//               <>
//                 <View {...topResizePanResponder.panHandlers} style={styles.resizeHandleTopArea}>
//                   <View style={styles.resizeHandleVisualHorizontal} />
//                 </View>
//                 <View {...bottomResizePanResponder.panHandlers} style={styles.resizeHandleBottomArea}>
//                   <View style={styles.resizeHandleVisualHorizontal} />
//                 </View>
//                 <View {...leftResizePanResponder.panHandlers} style={styles.resizeHandleLeftArea}>
//                   <View style={styles.resizeHandleVisualVertical} />
//                 </View>
//                 <View {...rightResizePanResponder.panHandlers} style={styles.resizeHandleRightArea}>
//                   <View style={styles.resizeHandleVisualVertical} />
//                 </View>
//               </>
//             )}

//             <View style={styles.crosshair}>
//               <View style={styles.crosshairVertical} />
//               <View style={styles.crosshairHorizontal} />
//             </View>
//           </View>

//           <Text style={styles.scannerText}>Настройте рамку под задачу</Text>
//         </View>

//         <View style={styles.cameraControls}>
//           {!capturedPhoto && (
//             <TouchableOpacity
//               style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//               onPress={takePicture}
//               disabled={isTakingPhoto}
//             >
//               <View style={styles.captureButtonInner} />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     );
//   };

//   const renderPhotoWithFixedFrame = () => {
//     return (
//       <View
//         style={styles.photoContainer}
//         ref={photoContainerRef}
//         onLayout={() => {
//           photoContainerRef.current?.measure((fx, fy, width, height, px, py) => {
//             setPhotoLayout({ x: px, y: py, width, height });
//           });
//         }}
//       >
//         <ImageBackground source={{ uri: capturedPhoto }} style={styles.photoBackground} resizeMode="cover"></ImageBackground>
//         {renderFixedCropOverPhoto()}
//       </View>
//     );
//   };

//   if (!permission) return <View />;
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {capturedPhoto ? (
//         renderPhotoWithFixedFrame()
//       ) : (
//         <CameraView ref={cameraRef} style={styles.camera} facing="back">
//           {renderCameraContent()}
//         </CameraView>
//       )}

//       {showSolutions && <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />}

//       {showSolutions && (
//         <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
//           <View style={styles.closeButtonBackground}>
//             <Text style={styles.closeButtonText}>×</Text>
//           </View>
//         </TouchableOpacity>
//       )}

//       {showSolutions && (
//         <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }], zIndex: 2000 }]}>
//           {isScrolledToTop && <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />}

//           <View style={styles.swipeIndicator}>
//             <View style={styles.swipeLine} />
//           </View>

//           <ScrollView style={styles.solutionsScroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
//             {solutionData.methods.map((m, i) => (
//               <View key={i} style={styles.solutionWidget}>
//                 <Text style={styles.methodTitle}>{m.title}</Text>

//                 <View style={styles.formulasContainer}>
//                   <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                   {m.formulas.map((f, fi) => (
//                     <Text key={fi} style={styles.formulaText}>
//                       {f}
//                     </Text>
//                   ))}
//                 </View>

//                 <View style={styles.answerContainer}>
//                   <Text style={styles.answerText}>{m.answer}</Text>
//                 </View>

//                 <TouchableOpacity style={styles.stepsButton} onPress={() => handleShowSteps(i)}>
//                   <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "black" },

//   permissionText: { color: "white", fontSize: 18, textAlign: "center", marginBottom: 20 },
//   permissionButton: { backgroundColor: "#2E86AB", paddingHorizontal: 20, paddingVertical: 15, borderRadius: 10 },
//   permissionButtonText: { color: "white", fontSize: 16, fontWeight: "600" },

//   camera: { flex: 1 },
//   photoContainer: { flex: 1 },
//   photoBackground: { flex: 1, width: "100%", height: "100%" },

//   cropWrapper: {
//     position: "absolute",
//     overflow: "visible"
//   },
//   frameBorder: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" },
//   cropInner: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", borderRadius: 4 },

//   scannerOverlay: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 100 },
//   scannerFrame: {
//     borderWidth: 0,
//     borderColor: "rgba(255,255,255,0.3)",
//     backgroundColor: "transparent",
//     alignItems: "center",
//     justifyContent: "center"
//   },

//   cornerTopLeft: { position: "absolute", top: -1, left: -1, width: 20, height: 20, borderTopWidth: 3, borderLeftWidth: 3, borderColor: "white" },
//   cornerTopRight: { position: "absolute", top: -1, right: -1, width: 20, height: 20, borderTopWidth: 3, borderRightWidth: 3, borderColor: "white" },
//   cornerBottomLeft: { position: "absolute", bottom: -1, left: -1, width: 20, height: 20, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: "white" },
//   cornerBottomRight: { position: "absolute", bottom: -1, right: -1, width: 20, height: 20, borderBottomWidth: 3, borderRightWidth: 3, borderColor: "white" },

//   crosshair: { position: "absolute", alignItems: "center", justifyContent: "center", opacity: 0.5 },
//   crosshairVertical: { width: 1, height: 15, backgroundColor: "white" },
//   crosshairHorizontal: { width: 15, height: 1, backgroundColor: "white", position: "absolute" },

//   resizeHandleTopArea: { position: "absolute", top: -20, left: 0, right: 0, height: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleBottomArea: { position: "absolute", bottom: -20, left: 0, right: 0, height: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleLeftArea: { position: "absolute", left: -20, top: 0, bottom: 0, width: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleRightArea: { position: "absolute", right: -20, top: 0, bottom: 0, width: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },

//   resizeHandleVisualHorizontal: { width: 40, height: 4, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 2 },
//   resizeHandleVisualVertical: { width: 4, height: 40, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 2 },

//   scannerText: { color: "white", fontSize: 16, marginTop: 30, textAlign: "center", textShadowColor: "black", textShadowRadius: 5 },

//   cameraControls: { position: "absolute", bottom: 40, left: 0, right: 0, alignItems: "center" },
//   captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: "rgba(255,255,255,0.3)", alignItems: "center", justifyContent: "center" },
//   captureButtonDisabled: { opacity: 0.5 },
//   captureButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: "white" },

//   outsideSwipeArea: { position: "absolute", top: 0, left: 0, right: 0, bottom: "40%", backgroundColor: "transparent", zIndex: 1999 },
//   closeButton: { position: "absolute", top: 50, right: 20, zIndex: 2002 },
//   closeButtonBackground: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0, 0, 0, 0.5)", alignItems: "center", justifyContent: "center" },
//   closeButtonText: { color: "white", fontSize: 24, fontWeight: "bold", marginTop: -2 },

//   solutionsContainer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: `${Math.floor(
//     BOTTOM_PANEL_RATIO * 100
//   )}%`, zIndex: 2000 },
//   overlaySwipeArea: { position: "absolute", top: 0, left: 0, right: 0, height: 60, backgroundColor: "transparent", zIndex: 2001 },
//   swipeIndicator: { alignItems: "center", paddingTop: 8, paddingBottom: 8, zIndex: 2001 },
//   swipeLine: { width: 40, height: 4, backgroundColor: "#ccc", borderRadius: 2 },
//   solutionsScroll: { flex: 1 },
//   scrollContent: { padding: 16, paddingTop: 0 },

//   solutionWidget: { backgroundColor: "#f8f9fa", borderRadius: 12, padding: 20, marginBottom: 16, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
//   methodTitle: { fontSize: 16, fontWeight: "bold", color: "#2c3e50", marginBottom: 12 },
//   formulasContainer: { backgroundColor: "white", padding: 12, borderRadius: 8, marginBottom: 12 },
//   formulasLabel: { fontSize: 14, fontWeight: "bold", color: "#2c3e50", marginBottom: 8 },
//   formulaText: { fontSize: 14, color: "#2c3e50", fontFamily: "monospace", marginBottom: 6, lineHeight: 18 },
//   answerContainer: { backgroundColor: "#E3F2FD", padding: 12, borderRadius: 8, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: "#2196F3" },
//   answerText: { fontSize: 16, fontWeight: "bold", color: "#1976D2", textAlign: "left" },
//   stepsButton: { backgroundColor: "#2196F3", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: "center" },
//   stepsButtonText: { color: "white", fontSize: 14, fontWeight: "600" }
// });

// import React, { useRef, useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
//   Animated,
//   PanResponder,
//   Image,
//   Dimensions,
//   Platform,
//   Easing
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// const BOTTOM_PANEL_RATIO = 0.45;
// const TOP_AVAILABLE_RATIO = 1 - BOTTOM_PANEL_RATIO;
// const TOP_MARGIN = Platform.OS === "android" ? 24 : 34;
// const MAX_FRAME_HEIGHT = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN - 8;

// export default function PhysicsSolver() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);
//   const frameRef = useRef(null); // Ссылка на рамку для измерения

//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [capturedPhoto, setCapturedPhoto] = useState(null);
//   const [showSolutions, setShowSolutions] = useState(false);
//   const [isScrolledToTop, setIsScrolledToTop] = useState(true);

//   // Анимация виджетов (снизу вверх)
//   const initialPanelTranslate = Math.floor(SCREEN_HEIGHT * BOTTOM_PANEL_RATIO);
//   const slideAnim = useRef(new Animated.Value(initialPanelTranslate)).current;
  
//   // Анимация рамки (от центра к верху)
//   const moveFrameAnim = useRef(new Animated.Value(0)).current;

//   // Храним координаты: где была рамка (source) и куда должна приехать (target)
//   const [sourceRect, setSourceRect] = useState(null);
//   const [targetRect, setTargetRect] = useState(null);

//   const [frameSize, setFrameSize] = useState({
//     width: Math.min(300, SCREEN_WIDTH - 40),
//     height: Math.min(200, MAX_FRAME_HEIGHT)
//   });
//   const initialFrameSize = useRef({ ...frameSize });

//   // ------------------- ЖЕСТЫ ДЛЯ ПАНЕЛИ (ВАШ СТАРЫЙ КОД) -------------------
//   const swipePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx),
//       onPanResponderMove: (_, g) => {
//         if (g.dy > 0) slideAnim.setValue(g.dy);
//       },
//       onPanResponderRelease: (_, g) => {
//         if (g.dy > 80) {
//           handleCloseWithAlert();
//         } else {
//           Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
//         }
//       }
//     })
//   ).current;

//   // ------------------- ЖЕСТЫ РЕСАЙЗА РАМКИ (ВАШ СТАРЫЙ КОД) -------------------
//   const MIN_SIZE = 100;
//   const MAX_WIDTH = SCREEN_WIDTH - 40;
//   const MAX_HEIGHT = MAX_FRAME_HEIGHT;

//   const handleResizeStart = () => {
//     initialFrameSize.current = { ...frameSize };
//   };

//   const topResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newHeight = Math.min(
//           MAX_HEIGHT,
//           Math.max(MIN_SIZE, initialFrameSize.current.height - g.dy * 2)
//         );
//         setFrameSize((p) => ({ ...p, height: newHeight }));
//       }
//     })
//   ).current;

//   const bottomResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newHeight = Math.min(
//           MAX_HEIGHT,
//           Math.max(MIN_SIZE, initialFrameSize.current.height + g.dy * 2)
//         );
//         setFrameSize((p) => ({ ...p, height: newHeight }));
//       }
//     })
//   ).current;

//   const leftResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - g.dx * 2));
//         setFrameSize((p) => ({ ...p, width: newWidth }));
//       }
//     })
//   ).current;

//   const rightResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + g.dx * 2));
//         setFrameSize((p) => ({ ...p, width: newWidth }));
//       }
//     })
//   ).current;

//   // ------------------- ВАШИ ДАННЫЕ ДЛЯ ВИДЖЕТОВ -------------------
//   const solutionData = {
//     methods: [
//       {
//         title: "Способ 1. Через геометрию и равнодействующую силу",
//         formulas: ["Закон Кулона: F = k |q₁q₂|/r²", "R = a/√3"],
//         answer: "Заряд в центре = +0.78 мКл",
//         steps: ["Шаг 1: ...", "Шаг 2: ..."]
//       },
//       {
//         title: "Способ 2. Через потенциал",
//         formulas: ["φ = 3kq/R", "R = a/√3"],
//         answer: "Заряд в центре = +0.78 мКл",
//         steps: ["Шаг 1: ...", "Шаг 2: ..."]
//       }
//     ]
//   };

//   // Адрес твоего локального Python-сервера


// const SERVER_URL = `http://192.168.0.11:5000/solve`; !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 



//   // ------------------- НОВАЯ ЛОГИКА ФОТО И АНИМАЦИИ -------------------
//   const takePicture = async () => {
//     if (!cameraRef.current || !frameRef.current) return;
//     setIsTakingPhoto(true);

//     try {
//       // 1. Измеряем, где рамка находится СЕЙЧАС (до снимка)
//       frameRef.current.measure((fx, fy, width, height, px, py) => {
//         setSourceRect({ x: px, y: py, width, height });

//         // 2. Вычисляем, куда рамка должна ПРИЕХАТЬ
//         // Центрируем её в верхней доступной области
//         const availableHeight = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN;
//         const targetY = TOP_MARGIN + (availableHeight - height) / 2;
//         const targetX = (SCREEN_WIDTH - width) / 2;
        
//         setTargetRect({ x: targetX, y: targetY });
//       });

//       // 3. Делаем фото
//       const photo = await cameraRef.current.takePictureAsync({ skipProcessing: true });
//       setCapturedPhoto(photo.uri);

//       // 4. Запускаем анимации
//       setTimeout(() => {
//         setIsTakingPhoto(false);
//         setShowSolutions(true);
        
//         Animated.parallel([
//           // Виджеты выезжают снизу (как было)
//           Animated.timing(slideAnim, { 
//             toValue: 0, 
//             duration: 420, 
//             useNativeDriver: true,
//             easing: Easing.out(Easing.cubic) 
//           }),
//           // Рамка едет наверх (новая механика)
//           Animated.timing(moveFrameAnim, {
//             toValue: 1,
//             duration: 420,
//             useNativeDriver: true,
//             easing: Easing.out(Easing.cubic) 
//           })
//         ]).start();
//       }, 100);

//     } catch (err) {
//       Alert.alert("Ошибка", "Не удалось сделать фото");
//       setIsTakingPhoto(false);
//       setCapturedPhoto(null);
//     }
//   };

//   const handleCloseSolutions = () => {
//     Animated.parallel([
//       Animated.timing(slideAnim, { toValue: initialPanelTranslate, duration: 250, useNativeDriver: true }),
//       Animated.timing(moveFrameAnim, { toValue: 0, duration: 250, useNativeDriver: true })
//     ]).start(() => {
//       setShowSolutions(false);
//       setCapturedPhoto(null);
//       setSourceRect(null);
//       setTargetRect(null);
//     });
//   };

//   const handleCloseWithAlert = () => {
//     Alert.alert("Вернуться?", "Хотите вернуться к камере?", [
//       {
//         text: "Отмена",
//         style: "cancel",
//         onPress: () => Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start()
//       },
//       { text: "Да", onPress: handleCloseSolutions }
//     ]);
//   };

//   const handleShowSteps = (index) => {
//     Alert.alert(solutionData.methods[index].title, solutionData.methods[index].steps.join("\n\n"));
//   };

//   const handleScroll = (e) => {
//     setIsScrolledToTop(e.nativeEvent.contentOffset.y <= 10);
//   };

//   // ------------------- РЕНДЕР: АНИМИРОВАННАЯ РАМКА НА СЕРОМ ФОНЕ -------------------
//   const renderAnimatedResult = () => {
//     if (!capturedPhoto || !sourceRect || !targetRect) return null;

//     // Интерполяция позиции рамки
//     const translateY = moveFrameAnim.interpolate({
//       inputRange: [0, 1],
//       outputRange: [sourceRect.y, targetRect.y]
//     });

//     const translateX = moveFrameAnim.interpolate({
//       inputRange: [0, 1],
//       outputRange: [sourceRect.x, targetRect.x]
//     });

//     return (
//       <View style={[StyleSheet.absoluteFill, { backgroundColor: "#222" }]}> 
//         {/* Серый фон вместо камеры */}

//         <Animated.View
//           style={{
//             position: "absolute",
//             width: sourceRect.width,
//             height: sourceRect.height,
//             transform: [{ translateX }, { translateY }],
//             overflow: "hidden", // ОБРЕЗАЕМ всё лишнее
//             borderRadius: 4, // Слегка скругляем как в оригинале
//             borderWidth: 0, // Убираем рамку или делаем тонкую
//             zIndex: 10
//           }}
//         >
//           {/* САМОЕ ВАЖНОЕ: Картинка внутри сдвинута ровно на минус координаты исходной рамки.
//             Это создает эффект, что мы "вырезали" именно тот кусок, который видели в камере.
//           */}
//           <Image
//             source={{ uri: capturedPhoto }}
//             style={{
//               position: "absolute",
//               width: SCREEN_WIDTH,
//               height: SCREEN_HEIGHT,
//               top: -sourceRect.y,
//               left: -sourceRect.x,
//             }}
//             resizeMode="cover"
//           />
          
//           {/* Рисуем белую обводку поверх вырезанного куска */}
//           <View style={[StyleSheet.absoluteFill, { borderWidth: 2, borderColor: 'white', borderRadius: 4 }]} />
//         </Animated.View>
//       </View>
//     );
//   };

//   // ------------------- РЕНДЕР КАМЕРЫ -------------------
//   const renderCameraContent = () => {
//     return (
//       <View style={styles.camera}>
//         <View style={styles.scannerOverlay}>
//           <View
//             ref={frameRef}
//             style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}
//           >
//             <View style={styles.cornerTopLeft} />
//             <View style={styles.cornerTopRight} />
//             <View style={styles.cornerBottomLeft} />
//             <View style={styles.cornerBottomRight} />

//             {!isTakingPhoto && !capturedPhoto && !showSolutions && (
//               <>
//                 <View {...topResizePanResponder.panHandlers} style={styles.resizeHandleTopArea}>
//                   <View style={styles.resizeHandleVisualHorizontal} />
//                 </View>
//                 <View {...bottomResizePanResponder.panHandlers} style={styles.resizeHandleBottomArea}>
//                   <View style={styles.resizeHandleVisualHorizontal} />
//                 </View>
//                 <View {...leftResizePanResponder.panHandlers} style={styles.resizeHandleLeftArea}>
//                   <View style={styles.resizeHandleVisualVertical} />
//                 </View>
//                 <View {...rightResizePanResponder.panHandlers} style={styles.resizeHandleRightArea}>
//                   <View style={styles.resizeHandleVisualVertical} />
//                 </View>
//               </>
//             )}

//             <View style={styles.crosshair}>
//               <View style={styles.crosshairVertical} />
//               <View style={styles.crosshairHorizontal} />
//             </View>
//           </View>

//           <Text style={styles.scannerText}>Настройте рамку под задачу</Text>
//         </View>

//         <View style={styles.cameraControls}>
//           {!capturedPhoto && (
//             <TouchableOpacity
//               style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//               onPress={takePicture}
//               disabled={isTakingPhoto}
//             >
//               <View style={styles.captureButtonInner} />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     );
//   };

//   if (!permission) return <View />;
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {capturedPhoto ? (
//         // ВМЕСТО `renderPhotoWithFixedFrame` ИСПОЛЬЗУЕМ НОВЫЙ РЕНДЕР
//         renderAnimatedResult()
//       ) : (
//         <CameraView ref={cameraRef} style={styles.camera} facing="back">
//           {renderCameraContent()}
//         </CameraView>
//       )}

//       {showSolutions && <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />}

//       {showSolutions && (
//         <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
//           <View style={styles.closeButtonBackground}>
//             <Text style={styles.closeButtonText}>×</Text>
//           </View>
//         </TouchableOpacity>
//       )}

//       {/* ВАШИ ОРИГИНАЛЬНЫЕ ВИДЖЕТЫ БЕЗ ИЗМЕНЕНИЙ */}
//       {showSolutions && (
//         <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }], zIndex: 2000 }]}>
//           {isScrolledToTop && <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />}

//           <View style={styles.swipeIndicator}>
//             <View style={styles.swipeLine} />
//           </View>

//           <ScrollView style={styles.solutionsScroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
//             {solutionData.methods.map((m, i) => (
//               <View key={i} style={styles.solutionWidget}>
//                 <Text style={styles.methodTitle}>{m.title}</Text>

//                 <View style={styles.formulasContainer}>
//                   <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                   {m.formulas.map((f, fi) => (
//                     <Text key={fi} style={styles.formulaText}>
//                       {f}
//                     </Text>
//                   ))}
//                 </View>

//                 <View style={styles.answerContainer}>
//                   <Text style={styles.answerText}>{m.answer}</Text>
//                 </View>

//                 <TouchableOpacity style={styles.stepsButton} onPress={() => handleShowSteps(i)}>
//                   <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// // ------------------- ВАШИ ОРИГИНАЛЬНЫЕ СТИЛИ (ПОЛНОСТЬЮ) -------------------
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "black" },

//   permissionText: { color: "white", fontSize: 18, textAlign: "center", marginBottom: 20 },
//   permissionButton: { backgroundColor: "#2E86AB", paddingHorizontal: 20, paddingVertical: 15, borderRadius: 10 },
//   permissionButtonText: { color: "white", fontSize: 16, fontWeight: "600" },

//   camera: { flex: 1 },
//   // photoContainer и cropWrapper удалены, так как теперь используется renderAnimatedResult
//   // но стили для камеры (рамки) оставлены:

//   scannerOverlay: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 100 },
//   scannerFrame: {
//     borderWidth: 0,
//     borderColor: "rgba(255,255,255,0.3)",
//     backgroundColor: "transparent",
//     alignItems: "center",
//     justifyContent: "center"
//   },

//   cornerTopLeft: { position: "absolute", top: -1, left: -1, width: 20, height: 20, borderTopWidth: 3, borderLeftWidth: 3, borderColor: "white" },
//   cornerTopRight: { position: "absolute", top: -1, right: -1, width: 20, height: 20, borderTopWidth: 3, borderRightWidth: 3, borderColor: "white" },
//   cornerBottomLeft: { position: "absolute", bottom: -1, left: -1, width: 20, height: 20, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: "white" },
//   cornerBottomRight: { position: "absolute", bottom: -1, right: -1, width: 20, height: 20, borderBottomWidth: 3, borderRightWidth: 3, borderColor: "white" },

//   crosshair: { position: "absolute", alignItems: "center", justifyContent: "center", opacity: 0.5 },
//   crosshairVertical: { width: 1, height: 15, backgroundColor: "white" },
//   crosshairHorizontal: { width: 15, height: 1, backgroundColor: "white", position: "absolute" },

//   resizeHandleTopArea: { position: "absolute", top: -20, left: 0, right: 0, height: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleBottomArea: { position: "absolute", bottom: -20, left: 0, right: 0, height: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleLeftArea: { position: "absolute", left: -20, top: 0, bottom: 0, width: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleRightArea: { position: "absolute", right: -20, top: 0, bottom: 0, width: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },

//   resizeHandleVisualHorizontal: { width: 40, height: 4, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 2 },
//   resizeHandleVisualVertical: { width: 4, height: 40, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 2 },

//   scannerText: { color: "white", fontSize: 16, marginTop: 30, textAlign: "center", textShadowColor: "black", textShadowRadius: 5 },

//   cameraControls: { position: "absolute", bottom: 40, left: 0, right: 0, alignItems: "center" },
//   captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: "rgba(255,255,255,0.3)", alignItems: "center", justifyContent: "center" },
//   captureButtonDisabled: { opacity: 0.5 },
//   captureButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: "white" },

//   outsideSwipeArea: { position: "absolute", top: 0, left: 0, right: 0, bottom: "40%", backgroundColor: "transparent", zIndex: 1999 },
//   closeButton: { position: "absolute", top: 50, right: 20, zIndex: 2002 },
//   closeButtonBackground: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0, 0, 0, 0.5)", alignItems: "center", justifyContent: "center" },
//   closeButtonText: { color: "white", fontSize: 24, fontWeight: "bold", marginTop: -2 },

//   solutionsContainer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: `${Math.floor(
//     BOTTOM_PANEL_RATIO * 100
//   )}%`, zIndex: 2000 },
//   overlaySwipeArea: { position: "absolute", top: 0, left: 0, right: 0, height: 60, backgroundColor: "transparent", zIndex: 2001 },
//   swipeIndicator: { alignItems: "center", paddingTop: 8, paddingBottom: 8, zIndex: 2001 },
//   swipeLine: { width: 40, height: 4, backgroundColor: "#ccc", borderRadius: 2 },
//   solutionsScroll: { flex: 1 },
//   scrollContent: { padding: 16, paddingTop: 0 },

//   solutionWidget: { backgroundColor: "#f8f9fa", borderRadius: 12, padding: 20, marginBottom: 16, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
//   methodTitle: { fontSize: 16, fontWeight: "bold", color: "#2c3e50", marginBottom: 12 },
//   formulasContainer: { backgroundColor: "white", padding: 12, borderRadius: 8, marginBottom: 12 },
//   formulasLabel: { fontSize: 14, fontWeight: "bold", color: "#2c3e50", marginBottom: 8 },
//   formulaText: { fontSize: 14, color: "#2c3e50", fontFamily: "monospace", marginBottom: 6, lineHeight: 18 },
//   answerContainer: { backgroundColor: "#E3F2FD", padding: 12, borderRadius: 8, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: "#2196F3" },
//   answerText: { fontSize: 16, fontWeight: "bold", color: "#1976D2", textAlign: "left" },
//   stepsButton: { backgroundColor: "#2196F3", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: "center" },
//   stepsButtonText: { color: "white", fontSize: 14, fontWeight: "600" }
// });


// import React, { useRef, useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
//   Animated,
//   PanResponder,
//   Image,
//   Dimensions,
//   Platform,
//   Easing
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// const BOTTOM_PANEL_RATIO = 0.45;
// const TOP_AVAILABLE_RATIO = 1 - BOTTOM_PANEL_RATIO;
// const TOP_MARGIN = Platform.OS === "android" ? 24 : 34;
// const MAX_FRAME_HEIGHT = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN - 8;

// // Адрес твоего локального Python-сервера
// // УБЕДИТЕСЬ, ЧТО ЭТОТ IP-АДРЕС 192.168.0.11 СОВПАДАЕТ С ТЕМ, ЧТО ВЫДАЕТ СЕРВЕР PYTHON
// const SERVER_URL = `http://192.168.0.11:5000/solve`; 

// export default function PhysicsSolver() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);
//   const frameRef = useRef(null); // Ссылка на рамку для измерения

//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [capturedPhoto, setCapturedPhoto] = useState(null);
//   const [showSolutions, setShowSolutions] = useState(false);
//   const [isScrolledToTop, setIsScrolledToTop] = useState(true);
  
//   // Добавляем состояние для хранения данных от сервера
//   const [collectedData, setCollectedData] = useState({ methods: [] });
//   // Добавляем состояние для индикации загрузки ответа от сервера
//   const [isProcessing, setIsProcessing] = useState(false); 

//   // Анимация виджетов (снизу вверх)
//   const initialPanelTranslate = Math.floor(SCREEN_HEIGHT * BOTTOM_PANEL_RATIO);
//   const slideAnim = useRef(new Animated.Value(initialPanelTranslate)).current;
  
//   // Анимация рамки (от центра к верху)
//   const moveFrameAnim = useRef(new Animated.Value(0)).current;

//   // Храним координаты: где была рамка (source) и куда должна приехать (target)
//   const [sourceRect, setSourceRect] = useState(null);
//   const [targetRect, setTargetRect] = useState(null);

//   const [frameSize, setFrameSize] = useState({
//     width: Math.min(300, SCREEN_WIDTH - 40),
//     height: Math.min(200, MAX_FRAME_HEIGHT)
//   });
//   const initialFrameSize = useRef({ ...frameSize });

//   // ------------------- ЖЕСТЫ ДЛЯ ПАНЕЛИ (ВАШ СТАРЫЙ КОД) -------------------
//   const swipePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx),
//       onPanResponderMove: (_, g) => {
//         if (g.dy > 0) slideAnim.setValue(g.dy);
//       },
//       onPanResponderRelease: (_, g) => {
//         if (g.dy > 80) {
//           handleCloseWithAlert();
//         } else {
//           Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
//         }
//       }
//     })
//   ).current;

//   // ------------------- ЖЕСТЫ РЕСАЙЗА РАМКИ (ВАШ СТАРЫЙ КОД) -------------------
//   const MIN_SIZE = 100;
//   const MAX_WIDTH = SCREEN_WIDTH - 40;
//   const MAX_HEIGHT = MAX_FRAME_HEIGHT;

//   const handleResizeStart = () => {
//     initialFrameSize.current = { ...frameSize };
//   };

//   const topResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newHeight = Math.min(
//           MAX_HEIGHT,
//           Math.max(MIN_SIZE, initialFrameSize.current.height - g.dy * 2)
//         );
//         setFrameSize((p) => ({ ...p, height: newHeight }));
//       }
//     })
//   ).current;

//   const bottomResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newHeight = Math.min(
//           MAX_HEIGHT,
//           Math.max(MIN_SIZE, initialFrameSize.current.height + g.dy * 2)
//         );
//         setFrameSize((p) => ({ ...p, height: newHeight }));
//       }
//     })
//   ).current;

//   const leftResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - g.dx * 2));
//         setFrameSize((p) => ({ ...p, width: newWidth }));
//       }
//     })
//   ).current;

//   const rightResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + g.dx * 2));
//         setFrameSize((p) => ({ ...p, width: newWidth }));
//       }
//     })
//   ).current;

//   // ------------------- НОВАЯ ЛОГИКА ФОТО И АНИМАЦИИ + СВЯЗЬ С СЕРВЕРОМ -------------------
//   const takePicture = async () => {
//     if (!cameraRef.current || !frameRef.current) return;
//     setIsTakingPhoto(true);
//     setIsProcessing(true); // Начало обработки (индикатор загрузки)

//     try {
//       // 1. Измеряем, где рамка находится СЕЙЧАС (до снимка)
//       let currentSourceRect = null;
//       frameRef.current.measure((fx, fy, width, height, px, py) => {
//         currentSourceRect = { x: px, y: py, width, height };
//         setSourceRect(currentSourceRect);

//         // 2. Вычисляем, куда рамка должна ПРИЕХАТЬ
//         const availableHeight = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN;
//         const targetY = TOP_MARGIN + (availableHeight - height) / 2;
//         const targetX = (SCREEN_WIDTH - width) / 2;
        
//         setTargetRect({ x: targetX, y: targetY });
//       });

//       // 3. Делаем фото
//       const photo = await cameraRef.current.takePictureAsync({ skipProcessing: true });
//       setCapturedPhoto(photo.uri);

//       // --- НОВЫЙ КОД: ОТПРАВКА НА СЕРВЕР ---
//       const data = new FormData();
//       // 'photo' - это имя, которое ожидает Flask-сервер в server.py (request.files.get('photo'))
//       data.append('photo', {
//           uri: photo.uri,
//           name: 'photo.jpg',
//           type: 'image/jpeg',
//       });
//       // Отправляем координаты рамки, чтобы сервер мог обрезать фото
//       data.append('sourceRect', JSON.stringify(currentSourceRect));

//       const response = await fetch(SERVER_URL, {
//           method: 'POST',
//           body: data,
//           headers: {
//               'Content-Type': 'multipart/form-data',
//           },
//       });

//       // Если связь с сервером установлена, получаем JSON
//       const result = await response.json();
      
//       if (result && result.success && result.solutions) {
//           setCollectedData({ methods: result.solutions }); // Обновляем данные для виджетов
//       } else {
//           Alert.alert("Ошибка сервера", result.message || "Сервер не смог обработать запрос. Проверьте логи Python.");
//           setCollectedData({ methods: [] });
//       }
//       // --- КОНЕЦ НОВОГО КОДА ---

//       // 4. Запускаем анимации
//       setTimeout(() => {
//         setIsTakingPhoto(false);
//         setIsProcessing(false); // Загрузка завершена
//         setShowSolutions(true);
        
//         Animated.parallel([
//           // Виджеты выезжают снизу
//           Animated.timing(slideAnim, { 
//             toValue: 0, 
//             duration: 420, 
//             useNativeDriver: true,
//             easing: Easing.out(Easing.cubic) 
//           }),
//           // Рамка едет наверх
//           Animated.timing(moveFrameAnim, {
//             toValue: 1,
//             duration: 420,
//             useNativeDriver: true,
//             easing: Easing.out(Easing.cubic) 
//           })
//         ]).start();
//       }, 100);

//     } catch (err) {
//       console.error("Ошибка при отправке/получении данных:", err);
//       Alert.alert("Ошибка подключения", "Не удалось связаться с сервером. Проверьте, запущен ли 'python server.py'.");
//       setIsTakingPhoto(false);
//       setIsProcessing(false);
//       setCapturedPhoto(null);
//     }
//   };

//   const handleCloseSolutions = () => {
//     Animated.parallel([
//       Animated.timing(slideAnim, { toValue: initialPanelTranslate, duration: 250, useNativeDriver: true }),
//       Animated.timing(moveFrameAnim, { toValue: 0, duration: 250, useNativeDriver: true })
//     ]).start(() => {
//       setShowSolutions(false);
//       setCapturedPhoto(null);
//       setSourceRect(null);
//       setTargetRect(null);
//       setCollectedData({ methods: [] }); // Очищаем старые данные
//     });
//   };

//   const handleCloseWithAlert = () => {
//     Alert.alert("Вернуться?", "Хотите вернуться к камере?", [
//       {
//         text: "Отмена",
//         style: "cancel",
//         onPress: () => Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start()
//       },
//       { text: "Да", onPress: handleCloseSolutions }
//     ]);
//   };

//   const handleShowSteps = (index) => {
//     if (collectedData.methods[index] && collectedData.methods[index].steps) {
//         Alert.alert(collectedData.methods[index].title, collectedData.methods[index].steps.join("\n\n"));
//     }
//   };

//   const handleScroll = (e) => {
//     setIsScrolledToTop(e.nativeEvent.contentOffset.y <= 10);
//   };

//   // ------------------- РЕНДЕР: АНИМИРОВАННАЯ РАМКА НА СЕРОМ ФОНЕ -------------------
//   const renderAnimatedResult = () => {
//     if (!capturedPhoto || !sourceRect || !targetRect) return null;

//     // Интерполяция позиции рамки
//     const translateY = moveFrameAnim.interpolate({
//       inputRange: [0, 1],
//       outputRange: [sourceRect.y, targetRect.y]
//     });

//     const translateX = moveFrameAnim.interpolate({
//       inputRange: [0, 1],
//       outputRange: [sourceRect.x, targetRect.x]
//     });

//     return (
//       <View style={[StyleSheet.absoluteFill, { backgroundColor: "#222" }]}> 
//         {/* Серый фон вместо камеры */}

//         <Animated.View
//           style={{
//             position: "absolute",
//             width: sourceRect.width,
//             height: sourceRect.height,
//             transform: [{ translateX }, { translateY }],
//             overflow: "hidden", // ОБРЕЗАЕМ всё лишнее
//             borderRadius: 4, // Слегка скругляем как в оригинале
//             borderWidth: 0, // Убираем рамку или делаем тонкую
//             zIndex: 10
//           }}
//         >
//           {/* САМОЕ ВАЖНОЕ: Картинка внутри сдвинута ровно на минус координаты исходной рамки.
//               Это создает эффект, что мы "вырезали" именно тот кусок, который видели в камере.
//            */}
//           <Image
//             source={{ uri: capturedPhoto }}
//             style={{
//               position: "absolute",
//               width: SCREEN_WIDTH,
//               height: SCREEN_HEIGHT,
//               top: -sourceRect.y,
//               left: -sourceRect.x,
//             }}
//             resizeMode="cover"
//           />
          
//           {/* Рисуем белую обводку поверх вырезанного куска */}
//           <View style={[StyleSheet.absoluteFill, { borderWidth: 2, borderColor: 'white', borderRadius: 4 }]} />
//         </Animated.View>
        
//         {/* Индикатор загрузки (показываем, пока идет обработка) */}
//         {isProcessing && (
//             <View style={styles.processingIndicator}>
//                 <Text style={styles.processingText}>Обработка задачи...</Text>
//             </View>
//         )}
//       </View>
//     );
//   };

//   // ------------------- РЕНДЕР КАМЕРЫ -------------------
//   const renderCameraContent = () => {
//     return (
//       <View style={styles.camera}>
//         <View style={styles.scannerOverlay}>
//           <View
//             ref={frameRef}
//             style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}
//           >
//             <View style={styles.cornerTopLeft} />
//             <View style={styles.cornerTopRight} />
//             <View style={styles.cornerBottomLeft} />
//             <View style={styles.cornerBottomRight} />

//             {!isTakingPhoto && !capturedPhoto && !showSolutions && (
//               <>
//                 <View {...topResizePanResponder.panHandlers} style={styles.resizeHandleTopArea}>
//                   <View style={styles.resizeHandleVisualHorizontal} />
//                 </View>
//                 <View {...bottomResizePanResponder.panHandlers} style={styles.resizeHandleBottomArea}>
//                   <View style={styles.resizeHandleVisualHorizontal} />
//                 </View>
//                 <View {...leftResizePanResponder.panHandlers} style={styles.resizeHandleLeftArea}>
//                   <View style={styles.resizeHandleVisualVertical} />
//                 </View>
//                 <View {...rightResizePanResponder.panHandlers} style={styles.resizeHandleRightArea}>
//                   <View style={styles.resizeHandleVisualVertical} />
//                 </View>
//               </>
//             )}

//             <View style={styles.crosshair}>
//               <View style={styles.crosshairVertical} />
//               <View style={styles.crosshairHorizontal} />
//             </View>
//           </View>

//           <Text style={styles.scannerText}>Настройте рамку под задачу</Text>
//         </View>

//         <View style={styles.cameraControls}>
//           {!capturedPhoto && (
//             <TouchableOpacity
//               style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//               onPress={takePicture}
//               disabled={isTakingPhoto || isProcessing} // Добавляем блокировку на время обработки
//             >
//               <View style={styles.captureButtonInner} />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     );
//   };

//   if (!permission) return <View />;
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {capturedPhoto ? (
//         renderAnimatedResult()
//       ) : (
//         <CameraView ref={cameraRef} style={styles.camera} facing="back">
//           {renderCameraContent()}
//         </CameraView>
//       )}

//       {showSolutions && <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />}

//       {showSolutions && (
//         <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
//           <View style={styles.closeButtonBackground}>
//             <Text style={styles.closeButtonText}>×</Text>
//           </View>
//         </TouchableOpacity>
//       )}

//       {/* ВАШИ ОРИГИНАЛЬНЫЕ ВИДЖЕТЫ */}
//       {showSolutions && (
//         <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }], zIndex: 2000 }]}>
//           {isScrolledToTop && <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />}

//           <View style={styles.swipeIndicator}>
//             <View style={styles.swipeLine} />
//           </View>

//           <ScrollView style={styles.solutionsScroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
//             {collectedData.methods.length > 0 ? (
//                 collectedData.methods.map((m, i) => (
//                     <View key={i} style={styles.solutionWidget}>
//                         <Text style={styles.methodTitle}>{m.title}</Text>

//                         <View style={styles.formulasContainer}>
//                             <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                             {m.formulas.map((f, fi) => (
//                                 <Text key={fi} style={styles.formulaText}>
//                                     {f}
//                                 </Text>
//                             ))}
//                         </View>

//                         <View style={styles.answerContainer}>
//                             <Text style={styles.answerText}>{m.answer}</Text>
//                         </View>

//                         <TouchableOpacity style={styles.stepsButton} onPress={() => handleShowSteps(i)}>
//                             <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                         </TouchableOpacity>
//                     </View>
//                 ))
//             ) : (
//                 <View style={styles.solutionWidget}>
//                     <Text style={styles.methodTitle}>Ошибка: Решение не найдено</Text>
//                     <Text style={styles.formulasLabel}>
//                         Похоже, сервер не смог получить или обработать ответ от DeepSeek. Проверьте терминал Python.
//                     </Text>
//                     <TouchableOpacity style={styles.stepsButton} onPress={handleCloseSolutions}>
//                         <Text style={styles.stepsButtonText}>Вернуться к камере</Text>
//                     </TouchableOpacity>
//                 </View>
//             )}
//           </ScrollView>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// // ------------------- ВАШИ ОРИГИНАЛЬНЫЕ СТИЛИ (ПОЛНОСТЬЮ) -------------------
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "black" },

//   permissionText: { color: "white", fontSize: 18, textAlign: "center", marginBottom: 20 },
//   permissionButton: { backgroundColor: "#2E86AB", paddingHorizontal: 20, paddingVertical: 15, borderRadius: 10 },
//   permissionButtonText: { color: "white", fontSize: 16, fontWeight: "600" },

//   camera: { flex: 1 },
//   // photoContainer и cropWrapper удалены, так как теперь используется renderAnimatedResult
//   // но стили для камеры (рамки) оставлены:

//   scannerOverlay: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 100 },
//   scannerFrame: {
//     borderWidth: 0,
//     borderColor: "rgba(255,255,255,0.3)",
//     backgroundColor: "transparent",
//     alignItems: "center",
//     justifyContent: "center"
//   },

//   cornerTopLeft: { position: "absolute", top: -1, left: -1, width: 20, height: 20, borderTopWidth: 3, borderLeftWidth: 3, borderColor: "white" },
//   cornerTopRight: { position: "absolute", top: -1, right: -1, width: 20, height: 20, borderTopWidth: 3, borderRightWidth: 3, borderColor: "white" },
//   cornerBottomLeft: { position: "absolute", bottom: -1, left: -1, width: 20, height: 20, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: "white" },
//   cornerBottomRight: { position: "absolute", bottom: -1, right: -1, width: 20, height: 20, borderBottomWidth: 3, borderRightWidth: 3, borderColor: "white" },

//   crosshair: { position: "absolute", alignItems: "center", justifyContent: "center", opacity: 0.5 },
//   crosshairVertical: { width: 1, height: 15, backgroundColor: "white" },
//   crosshairHorizontal: { width: 15, height: 1, backgroundColor: "white", position: "absolute" },

//   resizeHandleTopArea: { position: "absolute", top: -20, left: 0, right: 0, height: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleBottomArea: { position: "absolute", bottom: -20, left: 0, right: 0, height: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleLeftArea: { position: "absolute", left: -20, top: 0, bottom: 0, width: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleRightArea: { position: "absolute", right: -20, top: 0, bottom: 0, width: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },

//   resizeHandleVisualHorizontal: { width: 40, height: 4, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 2 },
//   resizeHandleVisualVertical: { width: 4, height: 40, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 2 },

//   scannerText: { color: "white", fontSize: 16, marginTop: 30, textAlign: "center", textShadowColor: "black", textShadowRadius: 5 },

//   cameraControls: { position: "absolute", bottom: 40, left: 0, right: 0, alignItems: "center" },
//   captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: "rgba(255,255,255,0.3)", alignItems: "center", justifyContent: "center" },
//   captureButtonDisabled: { opacity: 0.5 },
//   captureButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: "white" },

//   // НОВЫЙ СТИЛЬ ДЛЯ ИНДИКАТОРА ЗАГРУЗКИ
//   processingIndicator: {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: 'rgba(0,0,0,0.5)',
//       justifyContent: 'center',
//       alignItems: 'center',
//       zIndex: 100,
//   },
//   processingText: {
//       color: 'white',
//       fontSize: 18,
//       fontWeight: 'bold',
//       marginTop: 200,
//   },
  
//   outsideSwipeArea: { position: "absolute", top: 0, left: 0, right: 0, bottom: "40%", backgroundColor: "transparent", zIndex: 1999 },
//   closeButton: { position: "absolute", top: 50, right: 20, zIndex: 2002 },
//   closeButtonBackground: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0, 0, 0, 0.5)", alignItems: "center", justifyContent: "center" },
//   closeButtonText: { color: "white", fontSize: 24, fontWeight: "bold", marginTop: -2 },

//   solutionsContainer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: `${Math.floor(
//     BOTTOM_PANEL_RATIO * 100
//   )}%`, zIndex: 2000 },
//   overlaySwipeArea: { position: "absolute", top: 0, left: 0, right: 0, height: 60, backgroundColor: "transparent", zIndex: 2001 },
//   swipeIndicator: { alignItems: "center", paddingTop: 8, paddingBottom: 8, zIndex: 2001 },
//   swipeLine: { width: 40, height: 4, backgroundColor: "#ccc", borderRadius: 2 },
//   solutionsScroll: { flex: 1 },
//   scrollContent: { padding: 16, paddingTop: 0 },

//   solutionWidget: { backgroundColor: "#f8f9fa", borderRadius: 12, padding: 20, marginBottom: 16, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
//   methodTitle: { fontSize: 16, fontWeight: "bold", color: "#2c3e50", marginBottom: 12 },
//   formulasContainer: { backgroundColor: "white", padding: 12, borderRadius: 8, marginBottom: 12 },
//   formulasLabel: { fontSize: 14, fontWeight: "bold", color: "#2c3e50", marginBottom: 8 },
//   formulaText: { fontSize: 14, color: "#2c3e50", fontFamily: "monospace", marginBottom: 6, lineHeight: 18 },
//   answerContainer: { backgroundColor: "#E3F2FD", padding: 12, borderRadius: 8, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: "#2196F3" },
//   answerText: { fontSize: 16, fontWeight: "bold", color: "#1976D2", textAlign: "left" },
//   stepsButton: { backgroundColor: "#2196F3", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: "center" },
//   stepsButtonText: { color: "white", fontSize: 14, fontWeight: "600" }
// });

// import React, { useRef, useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
//   Animated,
//   PanResponder,
//   Image,
//   Dimensions,
//   Platform,
//   Easing
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";
// // !!! НЕ ЗАБУДЬТЕ, ЧТО FileSystem ДОЛЖЕН БЫТЬ ИМПОРТИРОВАН ИЗ expo-file-system
// import * as FileSystem from "expo-file-system"; 

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// const BOTTOM_PANEL_RATIO = 0.45;
// const TOP_AVAILABLE_RATIO = 1 - BOTTOM_PANEL_RATIO;
// const TOP_MARGIN = Platform.OS === "android" ? 24 : 34;
// const MAX_FRAME_HEIGHT = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN - 8;

// // Адрес твоего локального Python-сервера
// // УБЕДИТЕСЬ, ЧТО ЭТОТ IP-АДРЕС 192.168.0.11 СОВПАДАЕТ С ТЕМ, ЧТО ВЫДАЕТ СЕРВЕР PYTHON
// // Если IP изменился, ОБНОВИТЕ его ЗДЕСЬ.
// const SERVER_URL = `http://192.168.0.11:5000/solve`; 

// export default function PhysicsSolver() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);
//   const frameRef = useRef(null); // Ссылка на рамку для измерения

//   const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//   const [capturedPhoto, setCapturedPhoto] = useState(null);
//   const [showSolutions, setShowSolutions] = useState(false);
//   const [isScrolledToTop, setIsScrolledToTop] = useState(true);
//   
//   // Добавляем состояние для хранения данных от сервера
//   const [collectedData, setCollectedData] = useState<{ methods: { title: string, answer: string, formulas: string[], steps: string[] }[] }>({ methods: [] });
//   // Добавляем состояние для индикации загрузки ответа от сервера
//   const [isProcessing, setIsProcessing] = useState(false); 

//   // Анимация виджетов (снизу вверх)
//   const initialPanelTranslate = Math.floor(SCREEN_HEIGHT * BOTTOM_PANEL_RATIO);
//   const slideAnim = useRef(new Animated.Value(initialPanelTranslate)).current;
//   
//   // Анимация рамки (от центра к верху)
//   const moveFrameAnim = useRef(new Animated.Value(0)).current;

//   // Храним координаты: где была рамка (source) и куда должна приехать (target)
//   const [sourceRect, setSourceRect] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
//   const [targetRect, setTargetRect] = useState<{ x: number, y: number } | null>(null);

//   const [frameSize, setFrameSize] = useState({
//     width: Math.min(300, SCREEN_WIDTH - 40),
//     height: Math.min(200, MAX_FRAME_HEIGHT)
//   });
//   const initialFrameSize = useRef({ ...frameSize });

//   // ------------------- ЖЕСТЫ ДЛЯ ПАНЕЛИ -------------------
//   const swipePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx),
//       onPanResponderMove: (_, g) => {
//         // Проверяем, чтобы виджеты не уезжали слишком высоко
//         if (g.dy > 0) slideAnim.setValue(g.dy);
//       },
//       onPanResponderRelease: (_, g) => {
//         // Если свайпнули достаточно сильно вниз, закрываем
//         if (g.dy > 80) {
//           handleCloseWithAlert();
//         } else {
//           // Возвращаем виджеты на место (вверх)
//           Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
//         }
//       }
//     })
//   ).current;

//   // ------------------- ЖЕСТЫ РЕСАЙЗА РАМКИ -------------------
//   const MIN_SIZE = 100;
//   const MAX_WIDTH = SCREEN_WIDTH - 40;
//   const MAX_HEIGHT = MAX_FRAME_HEIGHT;

//   const handleResizeStart = () => {
//     initialFrameSize.current = { ...frameSize };
//   };

//   const topResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newHeight = Math.min(
//           MAX_HEIGHT,
//           Math.max(MIN_SIZE, initialFrameSize.current.height - g.dy * 2)
//         );
//         setFrameSize((p) => ({ ...p, height: newHeight }));
//       }
//     })
//   ).current;

//   const bottomResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newHeight = Math.min(
//           MAX_HEIGHT,
//           Math.max(MIN_SIZE, initialFrameSize.current.height + g.dy * 2)
//         );
//         setFrameSize((p) => ({ ...p, height: newHeight }));
//       }
//     })
//   ).current;

//   const leftResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - g.dx * 2));
//         setFrameSize((p) => ({ ...p, width: newWidth }));
//       }
//     })
//   ).current;

//   const rightResizePanResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//       onPanResponderGrant: handleResizeStart,
//       onPanResponderMove: (_, g) => {
//         const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + g.dx * 2));
//         setFrameSize((p) => ({ ...p, width: newWidth }));
//       }
//     })
//   ).current;

//   // ------------------- НОВАЯ ЛОГИКА ФОТО И АНИМАЦИИ + СВЯЗЬ С СЕРВЕРОМ -------------------
//   const takePicture = async () => {
//     if (!cameraRef.current || !frameRef.current) return;
//     setIsTakingPhoto(true);
//     setIsProcessing(true); // Начало обработки (индикатор загрузки)

//     try {
//       // 1. Измеряем, где рамка находится СЕЙЧАС (до снимка)
//       let currentSourceRect = null as { x: number, y: number, width: number, height: number } | null;

//       // Измерение асинхронно, поэтому используем колбэк для обновления состояния и вычисления targetRect
//       await new Promise<void>((resolve) => {
//         frameRef.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
//           currentSourceRect = { x: px, y: py, width, height };
//           setSourceRect(currentSourceRect);

//           // 2. Вычисляем, куда рамка должна ПРИЕХАТЬ
//           const availableHeight = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN;
//           const targetY = TOP_MARGIN + (availableHeight - height) / 2;
//           const targetX = (SCREEN_WIDTH - width) / 2;
//           
//           setTargetRect({ x: targetX, y: targetY });
//           resolve();
//         });
//       });

//       if (!currentSourceRect) {
//         throw new Error("Не удалось измерить позицию рамки.");
//       }

//       // 3. Делаем фото
//       const photo = await cameraRef.current.takePictureAsync({ skipProcessing: true });
//       setCapturedPhoto(photo.uri);

//       // --- НОВЫЙ КОД: ОТПРАВКА НА СЕРВЕР ---
//       // 1. Читаем файл как Base64
//       const base64Image = await FileSystem.readAsStringAsync(photo.uri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });
//     
//       // 2. Формируем JSON-объект
//       const requestData = {
//         image: base64Image, // Поле 'image' содержит Base64-строку
//         sourceRect: currentSourceRect, // Отправляем данные о рамке
//       };

//       // 3. Отправляем запрос
//       const response = await fetch(SERVER_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json', // <--- ТЕПЕРЬ ОЖИДАЕМ JSON
//         },
//         body: JSON.stringify(requestData), // Отправляем JSON
//       });

//       // 4. Обрабатываем ответ
//       const result = await response.json();
//       
//       // !!! ИСПРАВЛЕННАЯ ЛОГИКА ОБРАБОТКИ ОТВЕТА
//       if (result && result.success && result.solutions && Array.isArray(result.solutions)) {
//           setCollectedData({ methods: result.solutions }); // Обновляем данные для виджетов
//       } else {
//           Alert.alert("Ошибка сервера", result.message || "Сервер не смог обработать запрос. Проверьте логи Python. Возможно, ошибка авторизации Playwright.");
//           setCollectedData({ methods: [] });
//       }
//       // --- КОНЕЦ НОВОГО КОДА ---

//       // 5. Запускаем анимации
//       setTimeout(() => {
//         setIsTakingPhoto(false);
//         setIsProcessing(false); // Загрузка завершена
//         setShowSolutions(true);
//         
//         Animated.parallel([
//           // Виджеты выезжают снизу
//           Animated.timing(slideAnim, { 
//             toValue: 0, 
//             duration: 420, 
//             useNativeDriver: true,
//             easing: Easing.out(Easing.cubic) 
//           }),
//           // Рамка едет наверх
//           Animated.timing(moveFrameAnim, {
//             toValue: 1,
//             duration: 420,
//             useNativeDriver: true,
//             easing: Easing.out(Easing.cubic) 
//           })
//         ]).start();
//       }, 100);

//     } catch (err) {
//       // !!! ИСПРАВЛЕННЫЙ БЛОК CATCH
//       console.error("Ошибка при отправке/получении данных:", err);
//       // @ts-ignore
//       const errorMessage = err.message ? err.message : String(err);
//       Alert.alert("Ошибка подключения", `Не удалось связаться с сервером. Проверьте, запущен ли 'python server.py'. Детали: ${errorMessage}`);
//       setIsTakingPhoto(false);
//       setIsProcessing(false);
//       setCapturedPhoto(null);
//       setSourceRect(null); // Очищаем, чтобы анимация не зависла
//       setTargetRect(null); // Очищаем, чтобы анимация не зависла
//     }
//   };

//   const handleCloseSolutions = () => {
//     Animated.parallel([
//       Animated.timing(slideAnim, { toValue: initialPanelTranslate, duration: 250, useNativeDriver: true }),
//       Animated.timing(moveFrameAnim, { toValue: 0, duration: 250, useNativeDriver: true })
//     ]).start(() => {
//       setShowSolutions(false);
//       setCapturedPhoto(null);
//       setSourceRect(null);
//       setTargetRect(null);
//       setCollectedData({ methods: [] }); // Очищаем старые данные
//     });
//   };

//   const handleCloseWithAlert = () => {
//     Alert.alert("Вернуться?", "Хотите вернуться к камере?", [
//       {
//         text: "Отмена",
//         style: "cancel",
//         onPress: () => Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start()
//       },
//       { text: "Да", onPress: handleCloseSolutions }
//     ]);
//   };

//   const handleShowSteps = (index: number) => {
//     if (collectedData.methods[index] && collectedData.methods[index].steps) {
//         Alert.alert(collectedData.methods[index].title, collectedData.methods[index].steps.join("\n\n"));
//     }
//   };

//   const handleScroll = (e: any) => {
//     setIsScrolledToTop(e.nativeEvent.contentOffset.y <= 10);
//   };

//   // ------------------- РЕНДЕР: АНИМИРОВАННАЯ РАМКА НА СЕРОМ ФОНЕ -------------------
//   const renderAnimatedResult = () => {
//     if (!capturedPhoto || !sourceRect || !targetRect) return null;

//     // Интерполяция позиции рамки
//     const translateY = moveFrameAnim.interpolate({
//       inputRange: [0, 1],
//       outputRange: [sourceRect.y, targetRect.y]
//     });

//     const translateX = moveFrameAnim.interpolate({
//       inputRange: [0, 1],
//       outputRange: [sourceRect.x, targetRect.x]
//     });

//     return (
//       <View style={[StyleSheet.absoluteFill, { backgroundColor: "#222" }]}> 
//         {/* Серый фон вместо камеры */}

//         <Animated.View
//           style={{
//             position: "absolute",
//             width: sourceRect.width,
//             height: sourceRect.height,
//             transform: [{ translateX }, { translateY }],
//             overflow: "hidden", // ОБРЕЗАЕМ всё лишнее
//             borderRadius: 4, // Слегка скругляем как в оригинале
//             borderWidth: 0, // Убираем рамку или делаем тонкую
//             zIndex: 10
//           }}
//         >
//           {/* САМОЕ ВАЖНОЕ: Картинка внутри сдвинута ровно на минус координаты исходной рамки.
//               Это создает эффект, что мы "вырезали" именно тот кусок, который видели в камере.
//            */}
//           <Image
//             source={{ uri: capturedPhoto }}
//             style={{
//               position: "absolute",
//               width: SCREEN_WIDTH,
//               height: SCREEN_HEIGHT,
//               top: -sourceRect.y,
//               left: -sourceRect.x,
//             }}
//             resizeMode="cover"
//           />
//           
//           {/* Рисуем белую обводку поверх вырезанного куска */}
//           <View style={[StyleSheet.absoluteFill, { borderWidth: 2, borderColor: 'white', borderRadius: 4 }]} />
//         </Animated.View>
//         
//         {/* Индикатор загрузки (показываем, пока идет обработка) */}
//         {isProcessing && (
//             <View style={styles.processingIndicator}>
//                 <Text style={styles.processingText}>Обработка задачи...</Text>
//             </View>
//         )}
//       </View>
//     );
//   };

//   // ------------------- РЕНДЕР КАМЕРЫ -------------------
//   const renderCameraContent = () => {
//     return (
//       <View style={styles.camera}>
//         <View style={styles.scannerOverlay}>
//           <View
//             ref={frameRef}
//             style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}
//           >
//             <View style={styles.cornerTopLeft} />
//             <View style={styles.cornerTopRight} />
//             <View style={styles.cornerBottomLeft} />
//             <View style={styles.cornerBottomRight} />

//             {!isTakingPhoto && !capturedPhoto && !showSolutions && (
//               <>
//                 <View {...topResizePanResponder.panHandlers} style={styles.resizeHandleTopArea}>
//                   <View style={styles.resizeHandleVisualHorizontal} />
//                 </View>
//                 <View {...bottomResizePanResponder.panHandlers} style={styles.resizeHandleBottomArea}>
//                   <View style={styles.resizeHandleVisualHorizontal} />
//                 </View>
//                 <View {...leftResizePanResponder.panHandlers} style={styles.resizeHandleLeftArea}>
//                   <View style={styles.resizeHandleVisualVertical} />
//                 </View>
//                 <View {...rightResizePanResponder.panHandlers} style={styles.resizeHandleRightArea}>
//                   <View style={styles.resizeHandleVisualVertical} />
//                 </View>
//               </>
//             )}

//             <View style={styles.crosshair}>
//               <View style={styles.crosshairVertical} />
//               <View style={styles.crosshairHorizontal} />
//             </View>
//           </View>

//           <Text style={styles.scannerText}>Настройте рамку под задачу</Text>
//         </View>

//         <View style={styles.cameraControls}>
//           {!capturedPhoto && (
//             <TouchableOpacity
//               style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//               onPress={takePicture}
//               disabled={isTakingPhoto || isProcessing} // Добавляем блокировку на время обработки
//             >
//               <View style={styles.captureButtonInner} />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     );
//   };

//   if (!permission) return <View />;
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>Нужен доступ к камере</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionButtonText}>Разрешить</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {capturedPhoto ? (
//         renderAnimatedResult()
//       ) : (
//         <CameraView ref={cameraRef} style={styles.camera} facing="back">
//           {renderCameraContent()}
//         </CameraView>
//       )}

//       {showSolutions && <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />}

//       {showSolutions && (
//         <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
//           <View style={styles.closeButtonBackground}>
//             <Text style={styles.closeButtonText}>×</Text>
//           </View>
//         </TouchableOpacity>
//       )}

//       {/* ВАШИ ОРИГИНАЛЬНЫЕ ВИДЖЕТЫ */}
//       {showSolutions && (
//         <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }], zIndex: 2000 }]}>
//           {isScrolledToTop && <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />}

//           <View style={styles.swipeIndicator}>
//             <View style={styles.swipeLine} />
//           </View>

//           <ScrollView style={styles.solutionsScroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
//             {collectedData.methods.length > 0 ? (
//                 collectedData.methods.map((m, i) => (
//                     <View key={i} style={styles.solutionWidget}>
//                         <Text style={styles.methodTitle}>{m.title}</Text>

//                         <View style={styles.formulasContainer}>
//                             <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                             {m.formulas.map((f, fi) => (
//                                 <Text key={fi} style={styles.formulaText}>
//                                     {f}
//                                 </Text>
//                             ))}
//                         </View>

//                         <View style={styles.answerContainer}>
//                             <Text style={styles.answerText}>{m.answer}</Text>
//                         </View>

//                         <TouchableOpacity style={styles.stepsButton} onPress={() => handleShowSteps(i)}>
//                             <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                         </TouchableOpacity>
//                     </View>
//                 ))
//             ) : (
//                 <View style={styles.solutionWidget}>
//                     <Text style={styles.methodTitle}>Ошибка: Решение не найдено</Text>
//                     <Text style={styles.formulasLabel}>
//                         Похоже, сервер не смог получить или обработать ответ от DeepSeek. Проверьте терминал Python.
//                     </Text>
//                     <TouchableOpacity style={styles.stepsButton} onPress={handleCloseSolutions}>
//                         <Text style={styles.stepsButtonText}>Вернуться к камере</Text>
//                     </TouchableOpacity>
//                 </View>
//             )}
//           </ScrollView>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// // ------------------- ВАШИ ОРИГИНАЛЬНЫЕ СТИЛИ (ПОЛНОСТЬЮ) -------------------
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "black" },

//   permissionText: { color: "white", fontSize: 18, textAlign: "center", marginBottom: 20 },
//   permissionButton: { backgroundColor: "#2E86AB", paddingHorizontal: 20, paddingVertical: 15, borderRadius: 10 },
//   permissionButtonText: { color: "white", fontSize: 16, fontWeight: "600" },

//   camera: { flex: 1 },

//   scannerOverlay: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 100 },
//   scannerFrame: {
//     borderWidth: 0,
//     borderColor: "rgba(255,255,255,0.3)",
//     backgroundColor: "transparent",
//     alignItems: "center",
//     justifyContent: "center"
//   },

//   cornerTopLeft: { position: "absolute", top: -1, left: -1, width: 20, height: 20, borderTopWidth: 3, borderLeftWidth: 3, borderColor: "white" },
//   cornerTopRight: { position: "absolute", top: -1, right: -1, width: 20, height: 20, borderTopWidth: 3, borderRightWidth: 3, borderColor: "white" },
//   cornerBottomLeft: { position: "absolute", bottom: -1, left: -1, width: 20, height: 20, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: "white" },
//   cornerBottomRight: { position: "absolute", bottom: -1, right: -1, width: 20, height: 20, borderBottomWidth: 3, borderRightWidth: 3, borderColor: "white" },

//   crosshair: { position: "absolute", alignItems: "center", justifyContent: "center", opacity: 0.5 },
//   crosshairVertical: { width: 1, height: 15, backgroundColor: "white" },
//   crosshairHorizontal: { width: 15, height: 1, backgroundColor: "white", position: "absolute" },

//   resizeHandleTopArea: { position: "absolute", top: -20, left: 0, right: 0, height: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleBottomArea: { position: "absolute", bottom: -20, left: 0, right: 0, height: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleLeftArea: { position: "absolute", left: -20, top: 0, bottom: 0, width: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//   resizeHandleRightArea: { position: "absolute", right: -20, top: 0, bottom: 0, width: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },

//   resizeHandleVisualHorizontal: { width: 40, height: 4, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 2 },
//   resizeHandleVisualVertical: { width: 4, height: 40, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 2 },

//   scannerText: { color: "white", fontSize: 16, marginTop: 30, textAlign: "center", textShadowColor: "black", textShadowRadius: 5 },

//   cameraControls: { position: "absolute", bottom: 40, left: 0, right: 0, alignItems: "center" },
//   captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: "rgba(255,255,255,0.3)", alignItems: "center", justifyContent: "center" },
//   captureButtonDisabled: { opacity: 0.5 },
//   captureButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: "white" },

//   // НОВЫЙ СТИЛЬ ДЛЯ ИНДИКАТОРА ЗАГРУЗКИ
//   processingIndicator: {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: 'rgba(0,0,0,0.5)',
//       justifyContent: 'center',
//       alignItems: 'center',
//       zIndex: 100,
//   },
//   processingText: {
//       color: 'white',
//       fontSize: 18,
//       fontWeight: 'bold',
//       marginTop: 200,
//   },
//   
//   outsideSwipeArea: { position: "absolute", top: 0, left: 0, right: 0, bottom: "40%", backgroundColor: "transparent", zIndex: 1999 },
//   closeButton: { position: "absolute", top: 50, right: 20, zIndex: 2002 },
//   closeButtonBackground: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0, 0, 0, 0.5)", alignItems: "center", justifyContent: "center" },
//   closeButtonText: { color: "white", fontSize: 24, fontWeight: "bold", marginTop: -2 },

//   solutionsContainer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: `${Math.floor(
//     BOTTOM_PANEL_RATIO * 100
//   )}%`, zIndex: 2000 },
//   overlaySwipeArea: { position: "absolute", top: 0, left: 0, right: 0, height: 60, backgroundColor: "transparent", zIndex: 2001 },
//   swipeIndicator: { alignItems: "center", paddingTop: 8, paddingBottom: 8, zIndex: 2001 },
//   swipeLine: { width: 40, height: 4, backgroundColor: "#ccc", borderRadius: 2 },
//   solutionsScroll: { flex: 1 },
//   scrollContent: { padding: 16, paddingTop: 0 },

//   solutionWidget: { backgroundColor: "#f8f9fa", borderRadius: 12, padding: 20, marginBottom: 16, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
//   methodTitle: { fontSize: 16, fontWeight: "bold", color: "#2c3e50", marginBottom: 12 },
//   formulasContainer: { backgroundColor: "white", padding: 12, borderRadius: 8, marginBottom: 12 },
//   formulasLabel: { fontSize: 14, fontWeight: "bold", color: "#2c3e50", marginBottom: 8 },
//   formulaText: { fontSize: 14, color: "#2c3e50", fontFamily: "monospace", marginBottom: 6, lineHeight: 18 },
//   answerContainer: { backgroundColor: "#E3F2FD", padding: 12, borderRadius: 8, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: "#2196F3" },
//   answerText: { fontSize: 16, fontWeight: "bold", color: "#1976D2", textAlign: "left" },
//   stepsButton: { backgroundColor: "#2196F3", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: "center" },
//   stepsButtonText: { color: "white", fontSize: 14, fontWeight: "600" }
// });






// import React, { useRef, useState } from "react";
// import {
//     StyleSheet,
//     View,
//     Text,
//     TouchableOpacity,
//     Alert,
//     ScrollView,
//     Animated,
//     PanResponder,
//     Image,
//     Dimensions,
//     Platform,
//     Easing
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import * as FileSystem from "expo-file-system"; 

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// const BOTTOM_PANEL_RATIO = 0.45;
// const TOP_AVAILABLE_RATIO = 1 - BOTTOM_PANEL_RATIO;
// const TOP_MARGIN = Platform.OS === "android" ? 24 : 34;
// const MAX_FRAME_HEIGHT = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN - 8;

// // Адрес твоего локального Python-сервера
// // !!! ПРОВЕРЬТЕ: ЭТОТ IP-АДРЕС 192.168.0.11 ДОЛЖЕН СОВПАДАТЬ С IP ВАШЕГО КОМПЬЮТЕРА
// const SERVER_URL = `http://192.168.0.11:5000/solve`;

// // Интерфейсы для структуры данных
// interface SolutionMethod {
//     title: string;
//     answer: string;
//     formulas: string[];
//     steps: string[];
// }

// export default function PhysicsSolver() {
//     const [permission, requestPermission] = useCameraPermissions();
//     const cameraRef = useRef<CameraView>(null);
//     const frameRef = useRef<View>(null); 

//     const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//     const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
//     const [showSolutions, setShowSolutions] = useState(false);
//     const [isScrolledToTop, setIsScrolledToTop] = useState(true);
    
//     // Состояние для хранения данных от сервера
//     const [collectedData, setCollectedData] = useState<{ methods: SolutionMethod[] }>({ methods: [] });
//     const [isProcessing, setIsProcessing] = useState(false); 

//     // Анимация виджетов (снизу вверх)
//     const initialPanelTranslate = Math.floor(SCREEN_HEIGHT * BOTTOM_PANEL_RATIO);
//     const slideAnim = useRef(new Animated.Value(initialPanelTranslate)).current;
    
//     // Анимация рамки (от центра к верху)
//     const moveFrameAnim = useRef(new Animated.Value(0)).current;

//     // Храним координаты для анимации
//     const [sourceRect, setSourceRect] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
//     const [targetRect, setTargetRect] = useState<{ x: number, y: number } | null>(null);

//     const [frameSize, setFrameSize] = useState({
//         width: Math.min(300, SCREEN_WIDTH - 40),
//         height: Math.min(200, MAX_FRAME_HEIGHT)
//     });
//     const initialFrameSize = useRef({ ...frameSize });

//     // ------------------- ЖЕСТЫ И РЕСАЙЗ (без изменений) -------------------
//     const swipePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx),
//             onPanResponderMove: (_, g) => {
//                 if (g.dy > 0) slideAnim.setValue(g.dy);
//             },
//             onPanResponderRelease: (_, g) => {
//                 if (g.dy > 80) {
//                     handleCloseWithAlert();
//                 } else {
//                     Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
//                 }
//             }
//         })
//     ).current;

//     const MIN_SIZE = 100;
//     const MAX_WIDTH = SCREEN_WIDTH - 40;
//     const MAX_HEIGHT = MAX_FRAME_HEIGHT;

//     const handleResizeStart = () => {
//         initialFrameSize.current = { ...frameSize };
//     };

//     const topResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newHeight = Math.min(
//                     MAX_HEIGHT,
//                     Math.max(MIN_SIZE, initialFrameSize.current.height - g.dy * 2)
//                 );
//                 setFrameSize((p) => ({ ...p, height: newHeight }));
//             }
//         })
//     ).current;

//     const bottomResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newHeight = Math.min(
//                     MAX_HEIGHT,
//                     Math.max(MIN_SIZE, initialFrameSize.current.height + g.dy * 2)
//                 );
//                 setFrameSize((p) => ({ ...p, height: newHeight }));
//             }
//         })
//     ).current;

//     const leftResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - g.dx * 2));
//                 setFrameSize((p) => ({ ...p, width: newWidth }));
//             }
//         })
//     ).current;

//     const rightResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + g.dx * 2));
//                 setFrameSize((p) => ({ ...p, width: newWidth }));
//             }
//         })
//     ).current;

//     // ------------------- ЛОГИКА ФОТО И СЕРВЕРА (ИСПРАВЛЕНО) -------------------
//     const takePicture = async () => {
//         if (!cameraRef.current || !frameRef.current) return;
//         setIsTakingPhoto(true);
//         setIsProcessing(true); 

//         try {
//             let currentSourceRect = null as { x: number, y: number, width: number, height: number } | null;

//             await new Promise<void>((resolve) => {
//                 // @ts-ignore
//                 frameRef.current?.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
//                     currentSourceRect = { x: px, y: py, width, height };
//                     setSourceRect(currentSourceRect);

//                     const availableHeight = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN;
//                     const targetY = TOP_MARGIN + (availableHeight - height) / 2;
//                     const targetX = (SCREEN_WIDTH - width) / 2;
                    
//                     setTargetRect({ x: targetX, y: targetY });
//                     resolve();
//                 });
//             });

//             if (!currentSourceRect) {
//                 throw new Error("Не удалось измерить позицию рамки.");
//             }

//             // Делаем фото
//             const photo = await cameraRef.current.takePictureAsync({ skipProcessing: true });
//             setCapturedPhoto(photo.uri);

//             // Читаем файл как Base64
//             const base64Image = await FileSystem.readAsStringAsync(photo.uri, {
//                 encoding: FileSystem.EncodingType.Base64,
//             });
            
//             // Формируем JSON-объект (больше не отправляем sourceRect)
//             const requestData = {
//                 image: base64Image, 
//             };

//             // Отправляем запрос
//             const response = await fetch(SERVER_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(requestData), 
//             });

//             // Обрабатываем ответ
//             const result = await response.json();
            
//             // ИСПРАВЛЕННАЯ ЛОГИКА ОБРАБОТКИ ОТВЕТА
//             if (result && result.success && Array.isArray(result.solutions)) {
//                 setCollectedData({ methods: result.solutions });
//             } else {
//                 Alert.alert("Ошибка сервера", result.message || "Сервер не смог обработать запрос. Проверьте логи Python. Возможно, ошибка авторизации Playwright.");
//                 setCollectedData({ methods: [] });
//             }

//             // Запускаем анимации
//             setTimeout(() => {
//                 setIsTakingPhoto(false);
//                 setIsProcessing(false); 
//                 setShowSolutions(true);
                
//                 Animated.parallel([
//                     Animated.timing(slideAnim, { 
//                         toValue: 0, 
//                         duration: 420, 
//                         useNativeDriver: true,
//                         easing: Easing.out(Easing.cubic) 
//                     }),
//                     Animated.timing(moveFrameAnim, {
//                         toValue: 1,
//                         duration: 420,
//                         useNativeDriver: true,
//                         easing: Easing.out(Easing.cubic) 
//                     })
//                 ]).start();
//             }, 100);

//         } catch (err) {
//             console.error("Ошибка при отправке/получении данных:", err);
//             // @ts-ignore
//             const errorMessage = err.message ? err.message : String(err);
//             Alert.alert("Ошибка подключения", `Не удалось связаться с сервером. Проверьте, запущен ли 'python server.py' и корректен ли IP-адрес (${SERVER_URL}). Детали: ${errorMessage}`);
//             setIsTakingPhoto(false);
//             setIsProcessing(false);
//             setCapturedPhoto(null);
//             setSourceRect(null); 
//             setTargetRect(null); 
//         }
//     };

//     const handleCloseSolutions = () => {
//         Animated.parallel([
//             Animated.timing(slideAnim, { toValue: initialPanelTranslate, duration: 250, useNativeDriver: true }),
//             Animated.timing(moveFrameAnim, { toValue: 0, duration: 250, useNativeDriver: true })
//         ]).start(() => {
//             setShowSolutions(false);
//             setCapturedPhoto(null);
//             setSourceRect(null);
//             setTargetRect(null);
//             setCollectedData({ methods: [] }); 
//         });
//     };

//     const handleCloseWithAlert = () => {
//         Alert.alert("Вернуться?", "Хотите вернуться к камере?", [
//             {
//                 text: "Отмена",
//                 style: "cancel",
//                 onPress: () => Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start()
//             },
//             { text: "Да", onPress: handleCloseSolutions }
//         ]);
//     };

//     const handleShowSteps = (index: number) => {
//         if (collectedData.methods[index] && collectedData.methods[index].steps) {
//             Alert.alert(collectedData.methods[index].title, collectedData.methods[index].steps.join("\n\n"));
//         }
//     };

//     const handleScroll = (e: any) => {
//         setIsScrolledToTop(e.nativeEvent.contentOffset.y <= 10);
//     };

//     // ------------------- РЕНДЕР: АНИМИРОВАННАЯ РАМКА НА СЕРОМ ФОНЕ -------------------
//     const renderAnimatedResult = () => {
//         if (!capturedPhoto || !sourceRect || !targetRect) return null;

//         const translateY = moveFrameAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [sourceRect.y, targetRect.y]
//         });

//         const translateX = moveFrameAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [sourceRect.x, targetRect.x]
//         });

//         return (
//             <View style={[StyleSheet.absoluteFill, { backgroundColor: "#222" }]}> 
//                 <Animated.View
//                     style={{
//                         position: "absolute",
//                         width: sourceRect.width,
//                         height: sourceRect.height,
//                         transform: [{ translateX }, { translateY }],
//                         overflow: "hidden", 
//                         borderRadius: 4, 
//                         borderWidth: 0, 
//                         zIndex: 10
//                     }}
//                 >
//                     <Image
//                         source={{ uri: capturedPhoto }}
//                         style={{
//                             position: "absolute",
//                             width: SCREEN_WIDTH,
//                             height: SCREEN_HEIGHT,
//                             top: -sourceRect.y,
//                             left: -sourceRect.x,
//                         }}
//                         resizeMode="cover"
//                     />
                    
//                     <View style={[StyleSheet.absoluteFill, { borderWidth: 2, borderColor: 'white', borderRadius: 4 }]} />
//                 </Animated.View>
                
//                 {isProcessing && (
//                     <View style={styles.processingIndicator}>
//                         <Text style={styles.processingText}>Обработка задачи...</Text>
//                     </View>
//                 )}
//             </View>
//         );
//     };

//     // ------------------- РЕНДЕР КАМЕРЫ -------------------
//     const renderCameraContent = () => {
//         return (
//             <View style={styles.camera}>
//                 <View style={styles.scannerOverlay}>
//                     <View
//                         ref={frameRef}
//                         style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}
//                     >
//                         <View style={styles.cornerTopLeft} />
//                         <View style={styles.cornerTopRight} />
//                         <View style={styles.cornerBottomLeft} />
//                         <View style={styles.cornerBottomRight} />

//                         {!isTakingPhoto && !capturedPhoto && !showSolutions && (
//                             <>
//                                 <View {...topResizePanResponder.panHandlers} style={styles.resizeHandleTopArea}>
//                                     <View style={styles.resizeHandleVisualHorizontal} />
//                                 </View>
//                                 <View {...bottomResizePanResponder.panHandlers} style={styles.resizeHandleBottomArea}>
//                                     <View style={styles.resizeHandleVisualHorizontal} />
//                                 </View>
//                                 <View {...leftResizePanResponder.panHandlers} style={styles.resizeHandleLeftArea}>
//                                     <View style={styles.resizeHandleVisualVertical} />
//                                 </View>
//                                 <View {...rightResizePanResponder.panHandlers} style={styles.resizeHandleRightArea}>
//                                     <View style={styles.resizeHandleVisualVertical} />
//                                 </View>
//                             </>
//                         )}

//                         <View style={styles.crosshair}>
//                             <View style={styles.crosshairVertical} />
//                             <View style={styles.crosshairHorizontal} />
//                         </View>
//                     </View>

//                     <Text style={styles.scannerText}>Настройте рамку под задачу</Text>
//                 </View>

//                 <View style={styles.cameraControls}>
//                     {!capturedPhoto && (
//                         <TouchableOpacity
//                             style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//                             onPress={takePicture}
//                             disabled={isTakingPhoto || isProcessing} 
//                         >
//                             <View style={styles.captureButtonInner} />
//                         </TouchableOpacity>
//                     )}
//                 </View>
//             </View>
//         );
//     };

//     if (!permission) return <View />;
//     if (!permission.granted) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.permissionText}>Нужен доступ к камере</Text>
//                 <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//                     <Text style={styles.permissionButtonText}>Разрешить</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {capturedPhoto ? (
//                 renderAnimatedResult()
//             ) : (
//                 <CameraView ref={cameraRef} style={styles.camera} facing="back">
//                     {renderCameraContent()}
//                 </CameraView>
//             )}

//             {showSolutions && <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />}

//             {showSolutions && (
//                 <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
//                     <View style={styles.closeButtonBackground}>
//                         <Text style={styles.closeButtonText}>×</Text>
//                     </View>
//                 </TouchableOpacity>
//             )}

//             {showSolutions && (
//                 <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }], zIndex: 2000 }]}>
//                     {isScrolledToTop && <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />}

//                     <View style={styles.swipeIndicator}>
//                         <View style={styles.swipeLine} />
//                     </View>

//                     <ScrollView style={styles.solutionsScroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
//                         {collectedData.methods.length > 0 ? (
//                             collectedData.methods.map((m, i) => (
//                                 <View key={i} style={styles.solutionWidget}>
//                                     <Text style={styles.methodTitle}>{m.title}</Text>

//                                     <View style={styles.formulasContainer}>
//                                         <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                                         {m.formulas.map((f, fi) => (
//                                             <Text key={fi} style={styles.formulaText}>
//                                                 {f}
//                                             </Text>
//                                         ))}
//                                     </View>

//                                     <View style={styles.answerContainer}>
//                                         <Text style={styles.answerText}>{m.answer}</Text>
//                                     </View>

//                                     {/* УБРАНО: Кнопка "Показать шаги" будет показывать заглушку, так как DeepSeek возвращает решение одной строкой */}
//                                     <TouchableOpacity style={styles.stepsButton} onPress={() => handleShowSteps(i)}>
//                                         <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             ))
//                         ) : (
//                             <View style={styles.solutionWidget}>
//                                 <Text style={styles.methodTitle}>Ошибка: Решение не найдено</Text>
//                                 <Text style={styles.formulasLabel}>
//                                     Похоже, сервер не смог получить или обработать ответ от DeepSeek. Проверьте терминал Python.
//                                 </Text>
//                                 <TouchableOpacity style={styles.stepsButton} onPress={handleCloseSolutions}>
//                                     <Text style={styles.stepsButtonText}>Вернуться к камере</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         )}
//                     </ScrollView>
//                 </Animated.View>
//             )}
//         </View>
//     );
// }

// // ------------------- СТИЛИ (без изменений) -------------------
// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "black" },

//     permissionText: { color: "white", fontSize: 18, textAlign: "center", marginBottom: 20 },
//     permissionButton: { backgroundColor: "#2E86AB", paddingHorizontal: 20, paddingVertical: 15, borderRadius: 10 },
//     permissionButtonText: { color: "white", fontSize: 16, fontWeight: "600" },

//     camera: { flex: 1 },

//     scannerOverlay: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 100 },
//     scannerFrame: {
//         borderWidth: 0,
//         borderColor: "rgba(255,255,255,0.3)",
//         backgroundColor: "transparent",
//         alignItems: "center",
//         justifyContent: "center"
//     },

//     cornerTopLeft: { position: "absolute", top: -1, left: -1, width: 20, height: 20, borderTopWidth: 3, borderLeftWidth: 3, borderColor: "white" },
//     cornerTopRight: { position: "absolute", top: -1, right: -1, width: 20, height: 20, borderTopWidth: 3, borderRightWidth: 3, borderColor: "white" },
//     cornerBottomLeft: { position: "absolute", bottom: -1, left: -1, width: 20, height: 20, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: "white" },
//     cornerBottomRight: { position: "absolute", bottom: -1, right: -1, width: 20, height: 20, borderBottomWidth: 3, borderRightWidth: 3, borderColor: "white" },

//     crosshair: { position: "absolute", alignItems: "center", justifyContent: "center", opacity: 0.5 },
//     crosshairVertical: { width: 1, height: 15, backgroundColor: "white" },
//     crosshairHorizontal: { width: 15, height: 1, backgroundColor: "white", position: "absolute" },

//     resizeHandleTopArea: { position: "absolute", top: -20, left: 0, right: 0, height: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//     resizeHandleBottomArea: { position: "absolute", bottom: -20, left: 0, right: 0, height: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//     resizeHandleLeftArea: { position: "absolute", left: -20, top: 0, bottom: 0, width: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//     resizeHandleRightArea: { position: "absolute", right: -20, top: 0, bottom: 0, width: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },

//     resizeHandleVisualHorizontal: { width: 40, height: 4, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 2 },
//     resizeHandleVisualVertical: { width: 4, height: 40, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 2 },

//     scannerText: { color: "white", fontSize: 16, marginTop: 30, textAlign: "center", textShadowColor: "black", textShadowRadius: 5 },

//     cameraControls: { position: "absolute", bottom: 40, left: 0, right: 0, alignItems: "center" },
//     captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: "rgba(255,255,255,0.3)", alignItems: "center", justifyContent: "center" },
//     captureButtonDisabled: { opacity: 0.5 },
//     captureButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: "white" },

//     processingIndicator: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 100,
//     },
//     processingText: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginTop: 200,
//     },
    
//     outsideSwipeArea: { position: "absolute", top: 0, left: 0, right: 0, bottom: "40%", backgroundColor: "transparent", zIndex: 1999 },
//     closeButton: { position: "absolute", top: 50, right: 20, zIndex: 2002 },
//     closeButtonBackground: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0, 0, 0, 0.5)", alignItems: "center", justifyContent: "center" },
//     closeButtonText: { color: "white", fontSize: 24, fontWeight: "bold", marginTop: -2 },

//     solutionsContainer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: `${Math.floor(
//         BOTTOM_PANEL_RATIO * 100
//     )}%`, zIndex: 2000 },
//     overlaySwipeArea: { position: "absolute", top: 0, left: 0, right: 0, height: 60, backgroundColor: "transparent", zIndex: 2001 },
//     swipeIndicator: { alignItems: "center", paddingTop: 8, paddingBottom: 8, zIndex: 2001 },
//     swipeLine: { width: 40, height: 4, backgroundColor: "#ccc", borderRadius: 2 },
//     solutionsScroll: { flex: 1 },
//     scrollContent: { padding: 16, paddingTop: 0 },

//     solutionWidget: { backgroundColor: "#f8f9fa", borderRadius: 12, padding: 20, marginBottom: 16, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
//     methodTitle: { fontSize: 16, fontWeight: "bold", color: "#2c3e50", marginBottom: 12 },
//     formulasContainer: { backgroundColor: "white", padding: 12, borderRadius: 8, marginBottom: 12 },
//     formulasLabel: { fontSize: 14, fontWeight: "bold", color: "#2c3e50", marginBottom: 8 },
//     formulaText: { fontSize: 14, color: "#2c3e50", fontFamily: "monospace", marginBottom: 6, lineHeight: 18 },
//     answerContainer: { backgroundColor: "#E3F2FD", padding: 12, borderRadius: 8, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: "#2196F3" },
//     answerText: { fontSize: 16, fontWeight: "bold", color: "#1976D2", textAlign: "left" },
//     stepsButton: { backgroundColor: "#2196F3", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: "center" },
//     stepsButtonText: { color: "white", fontSize: 14, fontWeight: "600" }
// });












// import React, { useRef, useState } from "react";
// import {
//     StyleSheet,
//     View,
//     Text,
//     TouchableOpacity,
//     Alert,
//     ScrollView,
//     Animated,
//     PanResponder,
//     Image,
//     Dimensions,
//     Platform,
//     Easing
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import * as FileSystem from "expo-file-system"; 

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// const BOTTOM_PANEL_RATIO = 0.45;
// const TOP_AVAILABLE_RATIO = 1 - BOTTOM_PANEL_RATIO;
// const TOP_MARGIN = Platform.OS === "android" ? 24 : 34;
// const MAX_FRAME_HEIGHT = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN - 8;

// // Адрес твоего локального Python-сервера
// // !!! ПРОВЕРЬТЕ: ЭТОТ IP-АДРЕС 192.168.0.11 ДОЛЖЕН СОВПАДАТЬ С IP ВАШЕГО КОМПЬЮТЕРА
// const SERVER_URL = `http://192.168.0.11:5000/solve`; 

// // Интерфейсы для структуры данных
// interface SolutionMethod {
//     title: string;
//     answer: string;
//     formulas: string[];
//     steps: string[];
// }

// export default function PhysicsSolver() {
//     const [permission, requestPermission] = useCameraPermissions();
//     const cameraRef = useRef<CameraView>(null);
//     const frameRef = useRef<View>(null); 

//     const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//     const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
//     const [showSolutions, setShowSolutions] = useState(false);
//     const [isScrolledToTop, setIsScrolledToTop] = useState(true);
    
//     // Состояние для хранения данных от сервера
//     const [collectedData, setCollectedData] = useState<{ methods: SolutionMethod[] }>({ methods: [] });
//     const [isProcessing, setIsProcessing] = useState(false); 

//     // Анимация виджетов (снизу вверх)
//     const initialPanelTranslate = Math.floor(SCREEN_HEIGHT * BOTTOM_PANEL_RATIO);
//     const slideAnim = useRef(new Animated.Value(initialPanelTranslate)).current;
    
//     // Анимация рамки (от центра к верху)
//     const moveFrameAnim = useRef(new Animated.Value(0)).current;

//     // Храним координаты для анимации
//     const [sourceRect, setSourceRect] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
//     const [targetRect, setTargetRect] = useState<{ x: number, y: number } | null>(null);

//     const [frameSize, setFrameSize] = useState({
//         width: Math.min(300, SCREEN_WIDTH - 40),
//         height: Math.min(200, MAX_FRAME_HEIGHT)
//     });
//     const initialFrameSize = useRef({ ...frameSize });

//     // ------------------- ЖЕСТЫ И РЕСАЙЗ (без изменений) -------------------
//     const swipePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx),
//             onPanResponderMove: (_, g) => {
//                 if (g.dy > 0) slideAnim.setValue(g.dy);
//             },
//             onPanResponderRelease: (_, g) => {
//                 if (g.dy > 80) {
//                     handleCloseWithAlert();
//                 } else {
//                     Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
//                 }
//             }
//         })
//     ).current;

//     const MIN_SIZE = 100;
//     const MAX_WIDTH = SCREEN_WIDTH - 40;
//     const MAX_HEIGHT = MAX_FRAME_HEIGHT;

//     const handleResizeStart = () => {
//         initialFrameSize.current = { ...frameSize };
//     };

//     const topResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newHeight = Math.min(
//                     MAX_HEIGHT,
//                     Math.max(MIN_SIZE, initialFrameSize.current.height - g.dy * 2)
//                 );
//                 setFrameSize((p) => ({ ...p, height: newHeight }));
//             }
//         })
//     ).current;

//     const bottomResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newHeight = Math.min(
//                     MAX_HEIGHT,
//                     Math.max(MIN_SIZE, initialFrameSize.current.height + g.dy * 2)
//                 );
//                 setFrameSize((p) => ({ ...p, height: newHeight }));
//             }
//         })
//     ).current;

//     const leftResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - g.dx * 2));
//                 setFrameSize((p) => ({ ...p, width: newWidth }));
//             }
//         })
//     ).current;

//     const rightResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + g.dx * 2));
//                 setFrameSize((p) => ({ ...p, width: newWidth }));
//             }
//         })
//     ).current;

//     // ------------------- ЛОГИКА ФОТО И СЕРВЕРА (ИСПРАВЛЕНО) -------------------
//     const takePicture = async () => {
//         if (!cameraRef.current || !frameRef.current) return;
//         setIsTakingPhoto(true);
//         setIsProcessing(true); 

//         try {
//             let currentSourceRect = null as { x: number, y: number, width: number, height: number } | null;

//             await new Promise<void>((resolve) => {
//                 // @ts-ignore
//                 frameRef.current?.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
//                     currentSourceRect = { x: px, y: py, width, height };
//                     setSourceRect(currentSourceRect);

//                     const availableHeight = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN;
//                     const targetY = TOP_MARGIN + (availableHeight - height) / 2;
//                     const targetX = (SCREEN_WIDTH - width) / 2;
                    
//                     setTargetRect({ x: targetX, y: targetY });
//                     resolve();
//                 });
//             });

//             if (!currentSourceRect) {
//                 throw new Error("Не удалось измерить позицию рамки.");
//             }

//             // --- КРИТИЧЕСКАЯ ИСПРАВКА ЗДЕСЬ: Просим Expo вернуть Base64 сразу ---
//             const photo = await cameraRef.current.takePictureAsync({ 
//                 skipProcessing: true,
//                 base64: true, // Включаем возврат Base64
//             });
            
//             // Проверка на случай, если фото не сделано или Base64 отсутствует
//             if (!photo || !photo.uri || !photo.base64) {
//                  throw new Error("Камера не вернула фото или Base64. Проверьте разрешения.");
//             }

//             setCapturedPhoto(photo.uri);
            
//             // Base64 берем из объекта photo
//             const base64Image = photo.base64;
//             // --- КОНЕЦ ИСПРАВЛЕНИЯ ---
            
//             // Формируем JSON-объект
//             const requestData = {
//                 image: base64Image, 
//             };

//             // Отправляем запрос
//             const response = await fetch(SERVER_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(requestData), 
//             });

//             // Обрабатываем ответ
//             const result = await response.json();
            
//             // ИСПРАВЛЕННАЯ ЛОГИКА ОБРАБОТКИ ОТВЕТА
//             if (result && result.success && Array.isArray(result.solutions)) {
//                 setCollectedData({ methods: result.solutions });
//             } else {
//                 Alert.alert("Ошибка сервера", result.message || "Сервер не смог обработать запрос. Проверьте логи Python. Возможно, ошибка авторизации Playwright.");
//                 setCollectedData({ methods: [] });
//             }

//             // Запускаем анимации
//             setTimeout(() => {
//                 setIsTakingPhoto(false);
//                 setIsProcessing(false); 
//                 setShowSolutions(true);
                
//                 Animated.parallel([
//                     Animated.timing(slideAnim, { 
//                         toValue: 0, 
//                         duration: 420, 
//                         useNativeDriver: true,
//                         easing: Easing.out(Easing.cubic) 
//                     }),
//                     Animated.timing(moveFrameAnim, {
//                         toValue: 1,
//                         duration: 420,
//                         useNativeDriver: true,
//                         easing: Easing.out(Easing.cubic) 
//                     })
//                 ]).start();
//             }, 100);

//         } catch (err) {
//             console.error("Ошибка при отправке/получении данных:", err);
//             // @ts-ignore
//             const errorMessage = err.message ? err.message : String(err);
//             Alert.alert("Ошибка подключения", `Не удалось связаться с сервером. Проверьте, запущен ли 'python server.py' и корректен ли IP-адрес (${SERVER_URL}). Детали: ${errorMessage}`);
//             setIsTakingPhoto(false);
//             setIsProcessing(false);
//             setCapturedPhoto(null);
//             setSourceRect(null); 
//             setTargetRect(null); 
//         }
//     };

//     const handleCloseSolutions = () => {
//         Animated.parallel([
//             Animated.timing(slideAnim, { toValue: initialPanelTranslate, duration: 250, useNativeDriver: true }),
//             Animated.timing(moveFrameAnim, { toValue: 0, duration: 250, useNativeDriver: true })
//         ]).start(() => {
//             setShowSolutions(false);
//             setCapturedPhoto(null);
//             setSourceRect(null);
//             setTargetRect(null);
//             setCollectedData({ methods: [] }); 
//         });
//     };

//     const handleCloseWithAlert = () => {
//         Alert.alert("Вернуться?", "Хотите вернуться к камере?", [
//             {
//                 text: "Отмена",
//                 style: "cancel",
//                 onPress: () => Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start()
//             },
//             { text: "Да", onPress: handleCloseSolutions }
//         ]);
//     };

//     const handleShowSteps = (index: number) => {
//         if (collectedData.methods[index] && collectedData.methods[index].steps) {
//             Alert.alert(collectedData.methods[index].title, collectedData.methods[index].steps.join("\n\n"));
//         }
//     };

//     const handleScroll = (e: any) => {
//         setIsScrolledToTop(e.nativeEvent.contentOffset.y <= 10);
//     };

//     // ------------------- РЕНДЕР: АНИМИРОВАННАЯ РАМКА НА СЕРОМ ФОНЕ -------------------
//     const renderAnimatedResult = () => {
//         if (!capturedPhoto || !sourceRect || !targetRect) return null;

//         const translateY = moveFrameAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [sourceRect.y, targetRect.y]
//         });

//         const translateX = moveFrameAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [sourceRect.x, targetRect.x]
//         });

//         return (
//             <View style={[StyleSheet.absoluteFill, { backgroundColor: "#222" }]}> 
//                 <Animated.View
//                     style={{
//                         position: "absolute",
//                         width: sourceRect.width,
//                         height: sourceRect.height,
//                         transform: [{ translateX }, { translateY }],
//                         overflow: "hidden", 
//                         borderRadius: 4, 
//                         borderWidth: 0, 
//                         zIndex: 10
//                     }}
//                 >
//                     <Image
//                         source={{ uri: capturedPhoto }}
//                         style={{
//                             position: "absolute",
//                             width: SCREEN_WIDTH,
//                             height: SCREEN_HEIGHT,
//                             top: -sourceRect.y,
//                             left: -sourceRect.x,
//                         }}
//                         resizeMode="cover"
//                     />
                    
//                     <View style={[StyleSheet.absoluteFill, { borderWidth: 2, borderColor: 'white', borderRadius: 4 }]} />
//                 </Animated.View>
                
//                 {isProcessing && (
//                     <View style={styles.processingIndicator}>
//                         <Text style={styles.processingText}>Обработка задачи...</Text>
//                     </View>
//                 )}
//             </View>
//         );
//     };

//     // ------------------- РЕНДЕР КАМЕРЫ -------------------
//     const renderCameraContent = () => {
//         return (
//             <View style={styles.camera}>
//                 <View style={styles.scannerOverlay}>
//                     <View
//                         ref={frameRef}
//                         style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}
//                     >
//                         <View style={styles.cornerTopLeft} />
//                         <View style={styles.cornerTopRight} />
//                         <View style={styles.cornerBottomLeft} />
//                         <View style={styles.cornerBottomRight} />

//                         {!isTakingPhoto && !capturedPhoto && !showSolutions && (
//                             <>
//                                 <View {...topResizePanResponder.panHandlers} style={styles.resizeHandleTopArea}>
//                                     <View style={styles.resizeHandleVisualHorizontal} />
//                                 </View>
//                                 <View {...bottomResizePanResponder.panHandlers} style={styles.resizeHandleBottomArea}>
//                                     <View style={styles.resizeHandleVisualHorizontal} />
//                                 </View>
//                                 <View {...leftResizePanResponder.panHandlers} style={styles.resizeHandleLeftArea}>
//                                     <View style={styles.resizeHandleVisualVertical} />
//                                 </View>
//                                 <View {...rightResizePanResponder.panHandlers} style={styles.resizeHandleRightArea}>
//                                     <View style={styles.resizeHandleVisualVertical} />
//                                 </View>
//                             </>
//                         )}

//                         <View style={styles.crosshair}>
//                             <View style={styles.crosshairVertical} />
//                             <View style={styles.crosshairHorizontal} />
//                         </View>
//                     </View>

//                     <Text style={styles.scannerText}>Настройте рамку под задачу</Text>
//                 </View>

//                 <View style={styles.cameraControls}>
//                     {!capturedPhoto && (
//                         <TouchableOpacity
//                             style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
//                             onPress={takePicture}
//                             disabled={isTakingPhoto || isProcessing} 
//                         >
//                             <View style={styles.captureButtonInner} />
//                         </TouchableOpacity>
//                     )}
//                 </View>
//             </View>
//         );
//     };

//     if (!permission) return <View />;
//     if (!permission.granted) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.permissionText}>Нужен доступ к камере</Text>
//                 <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//                     <Text style={styles.permissionButtonText}>Разрешить</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {capturedPhoto ? (
//                 renderAnimatedResult()
//             ) : (
//                 <CameraView ref={cameraRef} style={styles.camera} facing="back">
//                     {renderCameraContent()}
//                 </CameraView>
//             )}

//             {showSolutions && <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />}

//             {showSolutions && (
//                 <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
//                     <View style={styles.closeButtonBackground}>
//                         <Text style={styles.closeButtonText}>×</Text>
//                     </View>
//                 </TouchableOpacity>
//             )}

//             {showSolutions && (
//                 <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }], zIndex: 2000 }]}>
//                     {isScrolledToTop && <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />}

//                     <View style={styles.swipeIndicator}>
//                         <View style={styles.swipeLine} />
//                     </View>

//                     <ScrollView style={styles.solutionsScroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16}>
//                         {collectedData.methods.length > 0 ? (
//                             collectedData.methods.map((m, i) => (
//                                 <View key={i} style={styles.solutionWidget}>
//                                     <Text style={styles.methodTitle}>{m.title}</Text>

//                                     <View style={styles.formulasContainer}>
//                                         <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                                         {m.formulas.map((f, fi) => (
//                                             <Text key={fi} style={styles.formulaText}>
//                                                 {f}
//                                             </Text>
//                                         ))}
//                                     </View>

//                                     <View style={styles.answerContainer}>
//                                         <Text style={styles.answerText}>{m.answer}</Text>
//                                     </View>

//                                     {/* УБРАНО: Кнопка "Показать шаги" будет показывать заглушку, так как DeepSeek возвращает решение одной строкой */}
//                                     <TouchableOpacity style={styles.stepsButton} onPress={() => handleShowSteps(i)}>
//                                         <Text style={styles.stepsButtonText}>Показать шаги</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             ))
//                         ) : (
//                             <View style={styles.solutionWidget}>
//                                 <Text style={styles.methodTitle}>Ошибка: Решение не найдено</Text>
//                                 <Text style={styles.formulasLabel}>
//                                     Похоже, сервер не смог получить или обработать ответ от DeepSeek. Проверьте терминал Python.
//                                 </Text>
//                                 <TouchableOpacity style={styles.stepsButton} onPress={handleCloseSolutions}>
//                                     <Text style={styles.stepsButtonText}>Вернуться к камере</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         )}
//                     </ScrollView>
//                 </Animated.View>
//             )}
//         </View>
//     );
// }

// // ------------------- СТИЛИ (без изменений) -------------------
// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "black" },

//     permissionText: { color: "white", fontSize: 18, textAlign: "center", marginBottom: 20 },
//     permissionButton: { backgroundColor: "#2E86AB", paddingHorizontal: 20, paddingVertical: 15, borderRadius: 10 },
//     permissionButtonText: { color: "white", fontSize: 16, fontWeight: "600" },

//     camera: { flex: 1 },

//     scannerOverlay: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 100 },
//     scannerFrame: {
//         borderWidth: 0,
//         borderColor: "rgba(255,255,255,0.3)",
//         backgroundColor: "transparent",
//         alignItems: "center",
//         justifyContent: "center"
//     },

//     cornerTopLeft: { position: "absolute", top: -1, left: -1, width: 20, height: 20, borderTopWidth: 3, borderLeftWidth: 3, borderColor: "white" },
//     cornerTopRight: { position: "absolute", top: -1, right: -1, width: 20, height: 20, borderTopWidth: 3, borderRightWidth: 3, borderColor: "white" },
//     cornerBottomLeft: { position: "absolute", bottom: -1, left: -1, width: 20, height: 20, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: "white" },
//     cornerBottomRight: { position: "absolute", bottom: -1, right: -1, width: 20, height: 20, borderBottomWidth: 3, borderRightWidth: 3, borderColor: "white" },

//     crosshair: { position: "absolute", alignItems: "center", justifyContent: "center", opacity: 0.5 },
//     crosshairVertical: { width: 1, height: 15, backgroundColor: "white" },
//     crosshairHorizontal: { width: 15, height: 1, backgroundColor: "white", position: "absolute" },

//     resizeHandleTopArea: { position: "absolute", top: -20, left: 0, right: 0, height: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//     resizeHandleBottomArea: { position: "absolute", bottom: -20, left: 0, right: 0, height: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//     resizeHandleLeftArea: { position: "absolute", left: -20, top: 0, bottom: 0, width: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },
//     resizeHandleRightArea: { position: "absolute", right: -20, top: 0, bottom: 0, width: 40, justifyContent: "center", alignItems: "center", zIndex: 10 },

//     resizeHandleVisualHorizontal: { width: 40, height: 4, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 2 },
//     resizeHandleVisualVertical: { width: 4, height: 40, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 2 },

//     scannerText: { color: "white", fontSize: 16, marginTop: 30, textAlign: "center", textShadowColor: "black", textShadowRadius: 5 },

//     cameraControls: { position: "absolute", bottom: 40, left: 0, right: 0, alignItems: "center" },
//     captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: "rgba(255,255,255,0.3)", alignItems: "center", justifyContent: "center" },
//     captureButtonDisabled: { opacity: 0.5 },
//     captureButtonInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: "white" },

//     processingIndicator: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 100,
//     },
//     processingText: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginTop: 200,
//     },
    
//     outsideSwipeArea: { position: "absolute", top: 0, left: 0, right: 0, bottom: "40%", backgroundColor: "transparent", zIndex: 1999 },
//     closeButton: { position: "absolute", top: 50, right: 20, zIndex: 2002 },
//     closeButtonBackground: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0, 0, 0, 0.5)", alignItems: "center", justifyContent: "center" },
//     closeButtonText: { color: "white", fontSize: 24, fontWeight: "bold", marginTop: -2 },

//     solutionsContainer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: `${Math.floor(
//         BOTTOM_PANEL_RATIO * 100
//     )}%`, zIndex: 2000 },
//     overlaySwipeArea: { position: "absolute", top: 0, left: 0, right: 0, height: 60, backgroundColor: "transparent", zIndex: 2001 },
//     swipeIndicator: { alignItems: "center", paddingTop: 8, paddingBottom: 8, zIndex: 2001 },
//     swipeLine: { width: 40, height: 4, backgroundColor: "#ccc", borderRadius: 2 },
//     solutionsScroll: { flex: 1 },
//     scrollContent: { padding: 16, paddingTop: 0 },

//     solutionWidget: { backgroundColor: "#f8f9fa", borderRadius: 12, padding: 20, marginBottom: 16, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
//     methodTitle: { fontSize: 16, fontWeight: "bold", color: "#2c3e50", marginBottom: 12 },
//     formulasContainer: { backgroundColor: "white", padding: 12, borderRadius: 8, marginBottom: 12 },
//     formulasLabel: { fontSize: 14, fontWeight: "bold", color: "#2c3e50", marginBottom: 8 },
//     formulaText: { fontSize: 14, color: "#2c3e50", fontFamily: "monospace", marginBottom: 6, lineHeight: 18 },
//     answerContainer: { backgroundColor: "#E3F2FD", padding: 12, borderRadius: 8, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: "#2196F3" },
//     answerText: { fontSize: 16, fontWeight: "bold", color: "#1976D2", textAlign: "left" },
//     stepsButton: { backgroundColor: "#2196F3", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: "center" },
//     stepsButtonText: { color: "white", fontSize: 14, fontWeight: "600" }
// });


// // Добавь эту функцию для проверки статуса сервера
// const checkServerStatus = async () => {
//   try {
//     const response = await fetch(`${SERVER_URL.replace('/solve', '')}/status`);
//     const status = await response.json();
//     console.log('Статус сервера:', status);
    
//     if (!status.chrome_connected) {
//       Alert.alert(
//         "Проверка подключения", 
//         "Сервер работает, но требуется авторизация в DeepSeek. Убедитесь, что вы вошли в свой аккаунт в открытом Chrome."
//       );
//     }
//   } catch (error) {
//     console.log('Сервер недоступен');
//   }
// };

// // Вызови эту функцию при загрузке приложения
// // useEffect(() => { checkServerStatus(); }, [])


// ---------------------------------------------------.
// import React, { useRef, useState, useEffect } from "react";
// import {
//     StyleSheet,
//     View,
//     Text,
//     TouchableOpacity,
//     Alert,
//     ScrollView,
//     Animated,
//     PanResponder,
//     Image,
//     Dimensions,
//     Platform,
//     Easing,
//     ActivityIndicator
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import * as FileSystem from "expo-file-system"; 

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// const BOTTOM_PANEL_RATIO = 0.45;
// const TOP_AVAILABLE_RATIO = 1 - BOTTOM_PANEL_RATIO;
// const TOP_MARGIN = Platform.OS === "android" ? 24 : 34;
// const MAX_FRAME_HEIGHT = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN - 8;

// // Адрес твоего локального Python-сервера
// const SERVER_URL = `http://192.168.0.11:5000/solve`;

// // Интерфейсы для структуры данных
// interface SolutionMethod {
//     title: string;
//     answer: string;
//     formulas: string[];
//     steps: string[];
// }

// export default function PhysicsSolver() {
//     const [permission, requestPermission] = useCameraPermissions();
//     const cameraRef = useRef<CameraView>(null);
//     const frameRef = useRef<View>(null); 

//     const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//     const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
//     const [showSolutions, setShowSolutions] = useState(false);
//     const [isScrolledToTop, setIsScrolledToTop] = useState(true);
    
//     // Состояние для хранения данных от сервера
//     const [collectedData, setCollectedData] = useState<{ methods: SolutionMethod[] }>({ methods: [] });
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

//     // Анимация виджетов (снизу вверх)
//     const initialPanelTranslate = Math.floor(SCREEN_HEIGHT * BOTTOM_PANEL_RATIO);
//     const slideAnim = useRef(new Animated.Value(initialPanelTranslate)).current;
    
//     // Анимация рамки (от центра к верху)
//     const moveFrameAnim = useRef(new Animated.Value(0)).current;

//     // Храним координаты для анимации
//     const [sourceRect, setSourceRect] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
//     const [targetRect, setTargetRect] = useState<{ x: number, y: number } | null>(null);

//     const [frameSize, setFrameSize] = useState({
//         width: Math.min(300, SCREEN_WIDTH - 40),
//         height: Math.min(200, MAX_FRAME_HEIGHT)
//     });
//     const initialFrameSize = useRef({ ...frameSize });

//     // Проверка статуса сервера при загрузке
//     useEffect(() => {
//         checkServerStatus();
//     }, []);

//     const checkServerStatus = async () => {
//         try {
//             const response = await fetch(SERVER_URL.replace('/solve', '/status'), {
//                 method: 'GET',
//                 timeout: 5000
//             });
//             const result = await response.json();
            
//             if (result.success) {
//                 setServerStatus('online');
//                 console.log('✅ Сервер работает, Chrome подключен');
//             } else {
//                 setServerStatus('offline');
//                 console.log('❌ Сервер недоступен или Chrome не подключен');
//             }
//         } catch (error) {
//             setServerStatus('offline');
//             console.log('❌ Не удалось подключиться к серверу');
//         }
//     };

//     // ------------------- ЖЕСТЫ И РЕСАЙЗ -------------------
//     const swipePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx),
//             onPanResponderMove: (_, g) => {
//                 if (g.dy > 0) slideAnim.setValue(g.dy);
//             },
//             onPanResponderRelease: (_, g) => {
//                 if (g.dy > 80) {
//                     handleCloseWithAlert();
//                 } else {
//                     Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
//                 }
//             }
//         })
//     ).current;

//     const MIN_SIZE = 100;
//     const MAX_WIDTH = SCREEN_WIDTH - 40;
//     const MAX_HEIGHT = MAX_FRAME_HEIGHT;

//     const handleResizeStart = () => {
//         initialFrameSize.current = { ...frameSize };
//     };

//     const topResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newHeight = Math.min(
//                     MAX_HEIGHT,
//                     Math.max(MIN_SIZE, initialFrameSize.current.height - g.dy * 2)
//                 );
//                 setFrameSize((p) => ({ ...p, height: newHeight }));
//             }
//         })
//     ).current;

//     const bottomResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newHeight = Math.min(
//                     MAX_HEIGHT,
//                     Math.max(MIN_SIZE, initialFrameSize.current.height + g.dy * 2)
//                 );
//                 setFrameSize((p) => ({ ...p, height: newHeight }));
//             }
//         })
//     ).current;

//     const leftResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - g.dx * 2));
//                 setFrameSize((p) => ({ ...p, width: newWidth }));
//             }
//         })
//     ).current;

//     const rightResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + g.dx * 2));
//                 setFrameSize((p) => ({ ...p, width: newWidth }));
//             }
//         })
//     ).current;

//     // ------------------- ОСНОВНАЯ ЛОГИКА -------------------
//     const takePicture = async () => {
//         if (!cameraRef.current || !frameRef.current) return;
        
//         // Проверяем статус сервера перед съемкой
//         if (serverStatus === 'offline') {
//             Alert.alert(
//                 "Сервер недоступен", 
//                 "Проверьте:\n1. Запущен ли server.py на компьютере\n2. Запущен ли Chrome через start_chrome.bat\n3. Правильный ли IP-адрес в настройках",
//                 [{ text: "Понятно" }]
//             );
//             return;
//         }

//         setIsTakingPhoto(true);
//         setIsProcessing(true); 

//         try {
//             let currentSourceRect = null as { x: number, y: number, width: number, height: number } | null;

//             // Получаем координаты рамки
//             await new Promise<void>((resolve, reject) => {
//                 if (!frameRef.current) {
//                     reject(new Error("Frame ref not available"));
//                     return;
//                 }

//                 // @ts-ignore
//                 frameRef.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
//                     currentSourceRect = { x: px, y: py, width, height };
//                     setSourceRect(currentSourceRect);

//                     const availableHeight = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN;
//                     const targetY = TOP_MARGIN + (availableHeight - height) / 2;
//                     const targetX = (SCREEN_WIDTH - width) / 2;
                    
//                     setTargetRect({ x: targetX, y: targetY });
//                     resolve();
//                 });
//             });

//             if (!currentSourceRect) {
//                 throw new Error("Не удалось измерить позицию рамки.");
//             }

//             // Делаем фото с Base64
//             console.log("📸 Делаем фото...");
//             const photo = await cameraRef.current.takePictureAsync({ 
//                 skipProcessing: true,
//                 base64: true,
//                 quality: 0.8
//             });
            
//             if (!photo || !photo.base64) {
//                 throw new Error("Камера не вернула фото в base64");
//             }

//             setCapturedPhoto(photo.uri);
//             console.log("✅ Фото сделано, отправляем на сервер...");

//             // Формируем запрос
//             const requestData = {
//                 image: photo.base64, 
//             };

//             // Отправляем на сервер с таймаутом
//             const controller = new AbortController();
//             const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 минуты таймаут

//             const response = await fetch(SERVER_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(requestData),
//                 signal: controller.signal
//             });

//             clearTimeout(timeoutId);

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const result = await response.json();
//             console.log("📡 Ответ от сервера:", result);

//             // Обрабатываем ответ
//             if (result && result.success && Array.isArray(result.solutions)) {
//                 setCollectedData({ methods: result.solutions });
//                 console.log(`✅ Получено ${result.solutions.length} решений`);
//             } else {
//                 throw new Error(result.message || "Сервер не вернул решения");
//             }

//             // Запускаем анимации успеха
//             setTimeout(() => {
//                 setIsTakingPhoto(false);
//                 setIsProcessing(false); 
//                 setShowSolutions(true);
                
//                 Animated.parallel([
//                     Animated.timing(slideAnim, { 
//                         toValue: 0, 
//                         duration: 420, 
//                         useNativeDriver: true,
//                         easing: Easing.out(Easing.cubic) 
//                     }),
//                     Animated.timing(moveFrameAnim, {
//                         toValue: 1,
//                         duration: 420,
//                         useNativeDriver: true,
//                         easing: Easing.out(Easing.cubic) 
//                     })
//                 ]).start();
//             }, 100);

//         } catch (err: any) {
//             console.error("❌ Ошибка:", err);
            
//             let errorMessage = "Неизвестная ошибка";
//             if (err.name === 'AbortError') {
//                 errorMessage = "Таймаут запроса (2 минуты). Проверьте сервер и DeepSeek.";
//             } else if (err.message) {
//                 errorMessage = err.message;
//             }

//             Alert.alert(
//                 "Ошибка", 
//                 `${errorMessage}\n\nПроверьте:\n• Запущен ли server.py\n• Вошли ли в DeepSeek в Chrome\n• Стабильно ли интернет-соединение`
//             );
            
//             setIsTakingPhoto(false);
//             setIsProcessing(false);
//             setCapturedPhoto(null);
//             setSourceRect(null); 
//             setTargetRect(null);
//         }
//     };

//     const handleCloseSolutions = () => {
//         Animated.parallel([
//             Animated.timing(slideAnim, { toValue: initialPanelTranslate, duration: 250, useNativeDriver: true }),
//             Animated.timing(moveFrameAnim, { toValue: 0, duration: 250, useNativeDriver: true })
//         ]).start(() => {
//             setShowSolutions(false);
//             setCapturedPhoto(null);
//             setSourceRect(null);
//             setTargetRect(null);
//             setCollectedData({ methods: [] });
//         });
//     };

//     const handleCloseWithAlert = () => {
//         Alert.alert("Вернуться?", "Хотите вернуться к камере?", [
//             {
//                 text: "Отмена",
//                 style: "cancel",
//                 onPress: () => Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start()
//             },
//             { text: "Да", onPress: handleCloseSolutions }
//         ]);
//     };

//     const handleShowSteps = (index: number) => {
//         if (collectedData.methods[index] && collectedData.methods[index].steps) {
//             Alert.alert(
//                 collectedData.methods[index].title, 
//                 collectedData.methods[index].steps.join("\n\n"),
//                 [{ text: "Закрыть", style: "cancel" }]
//             );
//         }
//     };

//     const handleScroll = (e: any) => {
//         setIsScrolledToTop(e.nativeEvent.contentOffset.y <= 10);
//     };

//     const retryServerConnection = () => {
//         setServerStatus('checking');
//         checkServerStatus();
//     };

//     // ------------------- РЕНДЕР ИНДИКАТОРА СТАТУСА -------------------
//     const renderStatusIndicator = () => {
//         if (serverStatus === 'checking') {
//             return (
//                 <View style={styles.statusContainer}>
//                     <ActivityIndicator size="small" color="#666" />
//                     <Text style={styles.statusText}>Проверка сервера...</Text>
//                 </View>
//             );
//         }

//         if (serverStatus === 'offline') {
//             return (
//                 <TouchableOpacity style={styles.statusContainer} onPress={retryServerConnection}>
//                     <View style={[styles.statusDot, { backgroundColor: '#ff4444' }]} />
//                     <Text style={[styles.statusText, { color: '#ff4444' }]}>Сервер недоступен</Text>
//                     <Text style={styles.retryText}>Нажмите для повторной проверки</Text>
//                 </TouchableOpacity>
//             );
//         }

//         return (
//             <View style={styles.statusContainer}>
//                 <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
//                 <Text style={[styles.statusText, { color: '#4CAF50' }]}>Сервер доступен</Text>
//             </View>
//         );
//     };

//     // ------------------- РЕНДЕР РЕЗУЛЬТАТА -------------------
//     const renderAnimatedResult = () => {
//         if (!capturedPhoto || !sourceRect || !targetRect) return null;

//         const translateY = moveFrameAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [sourceRect.y, targetRect.y]
//         });

//         const translateX = moveFrameAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [sourceRect.x, targetRect.x]
//         });

//         return (
//             <View style={[StyleSheet.absoluteFill, { backgroundColor: "#222" }]}> 
//                 <Animated.View
//                     style={{
//                         position: "absolute",
//                         width: sourceRect.width,
//                         height: sourceRect.height,
//                         transform: [{ translateX }, { translateY }],
//                         overflow: "hidden", 
//                         borderRadius: 4, 
//                         borderWidth: 0, 
//                         zIndex: 10
//                     }}
//                 >
//                     <Image
//                         source={{ uri: capturedPhoto }}
//                         style={{
//                             position: "absolute",
//                             width: SCREEN_WIDTH,
//                             height: SCREEN_HEIGHT,
//                             top: -sourceRect.y,
//                             left: -sourceRect.x,
//                         }}
//                         resizeMode="cover"
//                     />
                    
//                     <View style={[StyleSheet.absoluteFill, { borderWidth: 2, borderColor: 'white', borderRadius: 4 }]} />
//                 </Animated.View>
                
//                 {isProcessing && (
//                     <View style={styles.processingIndicator}>
//                         <ActivityIndicator size="large" color="#ffffff" />
//                         <Text style={styles.processingText}>Отправляем задачу в DeepSeek...</Text>
//                         <Text style={styles.processingSubtext}>Это может занять 1-2 минуты</Text>
//                     </View>
//                 )}
//             </View>
//         );
//     };

//     // ------------------- РЕНДЕР КАМЕРЫ -------------------
//     const renderCameraContent = () => {
//         return (
//             <View style={styles.camera}>
//                 <View style={styles.scannerOverlay}>
//                     {/* Индикатор статуса сервера */}
//                     {renderStatusIndicator()}

//                     <View
//                         ref={frameRef}
//                         style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}
//                     >
//                         <View style={styles.cornerTopLeft} />
//                         <View style={styles.cornerTopRight} />
//                         <View style={styles.cornerBottomLeft} />
//                         <View style={styles.cornerBottomRight} />

//                         {!isTakingPhoto && !capturedPhoto && !showSolutions && (
//                             <>
//                                 <View {...topResizePanResponder.panHandlers} style={styles.resizeHandleTopArea}>
//                                     <View style={styles.resizeHandleVisualHorizontal} />
//                                 </View>
//                                 <View {...bottomResizePanResponder.panHandlers} style={styles.resizeHandleBottomArea}>
//                                     <View style={styles.resizeHandleVisualHorizontal} />
//                                 </View>
//                                 <View {...leftResizePanResponder.panHandlers} style={styles.resizeHandleLeftArea}>
//                                     <View style={styles.resizeHandleVisualVertical} />
//                                 </View>
//                                 <View {...rightResizePanResponder.panHandlers} style={styles.resizeHandleRightArea}>
//                                     <View style={styles.resizeHandleVisualVertical} />
//                                 </View>
//                             </>
//                         )}

//                         <View style={styles.crosshair}>
//                             <View style={styles.crosshairVertical} />
//                             <View style={styles.crosshairHorizontal} />
//                         </View>
//                     </View>

//                     <Text style={styles.scannerText}>Наведите рамку на физическую задачу</Text>
//                     <Text style={styles.scannerSubtext}>Убедитесь, что текст хорошо виден</Text>
//                 </View>

//                 <View style={styles.cameraControls}>
//                     {!capturedPhoto && (
//                         <TouchableOpacity
//                             style={[
//                                 styles.captureButton, 
//                                 (isTakingPhoto || serverStatus === 'offline') && styles.captureButtonDisabled
//                             ]}
//                             onPress={takePicture}
//                             disabled={isTakingPhoto || serverStatus === 'offline'} 
//                         >
//                             <View style={styles.captureButtonInner} />
//                         </TouchableOpacity>
//                     )}
//                 </View>
//             </View>
//         );
//     };

//     if (!permission) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#2E86AB" />
//                 <Text style={styles.loadingText}>Загрузка разрешений...</Text>
//             </View>
//         );
//     }

//     if (!permission.granted) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.permissionText}>Нужен доступ к камере</Text>
//                 <Text style={styles.permissionSubtext}>Для работы приложения необходимо разрешение на использование камеры</Text>
//                 <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//                     <Text style={styles.permissionButtonText}>Разрешить использование камеры</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {capturedPhoto ? (
//                 renderAnimatedResult()
//             ) : (
//                 <CameraView 
//                     ref={cameraRef} 
//                     style={styles.camera} 
//                     facing="back"
//                     ratio="16:9"
//                 >
//                     {renderCameraContent()}
//                 </CameraView>
//             )}

//             {showSolutions && <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />}

//             {showSolutions && (
//                 <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
//                     <View style={styles.closeButtonBackground}>
//                         <Text style={styles.closeButtonText}>×</Text>
//                     </View>
//                 </TouchableOpacity>
//             )}

//             {showSolutions && (
//                 <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }], zIndex: 2000 }]}>
//                     {isScrolledToTop && <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />}

//                     <View style={styles.swipeIndicator}>
//                         <View style={styles.swipeLine} />
//                     </View>

//                     <ScrollView 
//                         style={styles.solutionsScroll} 
//                         contentContainerStyle={styles.scrollContent} 
//                         showsVerticalScrollIndicator={false} 
//                         onScroll={handleScroll} 
//                         scrollEventThrottle={16}
//                     >
//                         {collectedData.methods.length > 0 ? (
//                             collectedData.methods.map((m, i) => (
//                                 <View key={i} style={styles.solutionWidget}>
//                                     <Text style={styles.methodTitle}>{m.title}</Text>

//                                     <View style={styles.formulasContainer}>
//                                         <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                                         {m.formulas.map((f, fi) => (
//                                             <Text key={fi} style={styles.formulaText}>
//                                                 {f}
//                                             </Text>
//                                         ))}
//                                     </View>

//                                     <View style={styles.answerContainer}>
//                                         <Text style={styles.answerLabel}>Ответ:</Text>
//                                         <Text style={styles.answerText}>{m.answer}</Text>
//                                     </View>

//                                     <TouchableOpacity style={styles.stepsButton} onPress={() => handleShowSteps(i)}>
//                                         <Text style={styles.stepsButtonText}>📋 Показать шаги решения</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             ))
//                         ) : (
//                             <View style={styles.solutionWidget}>
//                                 <Text style={styles.methodTitle}>Решение не найдено</Text>
//                                 <Text style={styles.formulasLabel}>
//                                     DeepSeek не смог обработать задачу. Попробуйте:
//                                 </Text>
//                                 <Text style={styles.formulaText}>
//                                     • Сфотографировать более четко{"\n"}
//                                     • Убедиться, что задача физическая{"\n"}
//                                     • Проверить подключение к интернету
//                                 </Text>
//                                 <TouchableOpacity style={styles.stepsButton} onPress={handleCloseSolutions}>
//                                     <Text style={styles.stepsButtonText}>⟲ Попробовать снова</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         )}
//                     </ScrollView>
//                 </Animated.View>
//             )}
//         </View>
//     );
// }

// // ------------------- СТИЛИ -------------------
// const styles = StyleSheet.create({
//     container: { 
//         flex: 1, 
//         backgroundColor: "black" 
//     },
//     loadingText: {
//         color: "white", 
//         fontSize: 16, 
//         textAlign: "center", 
//         marginTop: 20
//     },

//     // Статус сервера
//     statusContainer: {
//         position: 'absolute',
//         top: Platform.OS === 'ios' ? 60 : 40,
//         left: 20,
//         right: 20,
//         backgroundColor: 'rgba(0,0,0,0.7)',
//         padding: 12,
//         borderRadius: 8,
//         flexDirection: 'row',
//         alignItems: 'center',
//         zIndex: 100
//     },
//     statusDot: {
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         marginRight: 8
//     },
//     statusText: {
//         color: 'white',
//         fontSize: 14,
//         fontWeight: '600'
//     },
//     retryText: {
//         color: 'rgba(255,255,255,0.7)',
//         fontSize: 12,
//         marginLeft: 'auto'
//     },

//     // Разрешения камеры
//     permissionText: { 
//         color: "white", 
//         fontSize: 22, 
//         fontWeight: "bold",
//         textAlign: "center", 
//         marginBottom: 12 
//     },
//     permissionSubtext: {
//         color: "rgba(255,255,255,0.8)", 
//         fontSize: 16, 
//         textAlign: "center", 
//         marginBottom: 30,
//         paddingHorizontal: 20,
//         lineHeight: 22
//     },
//     permissionButton: { 
//         backgroundColor: "#2E86AB", 
//         paddingHorizontal: 30, 
//         paddingVertical: 16, 
//         borderRadius: 12 
//     },
//     permissionButtonText: { 
//         color: "white", 
//         fontSize: 18, 
//         fontWeight: "600" 
//     },

//     camera: { 
//         flex: 1 
//     },

//     scannerOverlay: { 
//         flex: 1, 
//         alignItems: "center", 
//         justifyContent: "center", 
//         paddingBottom: 100 
//     },
//     scannerFrame: {
//         borderWidth: 0,
//         borderColor: "rgba(255,255,255,0.3)",
//         backgroundColor: "transparent",
//         alignItems: "center",
//         justifyContent: "center"
//     },

//     cornerTopLeft: { 
//         position: "absolute", 
//         top: -1, 
//         left: -1, 
//         width: 20, 
//         height: 20, 
//         borderTopWidth: 3, 
//         borderLeftWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerTopRight: { 
//         position: "absolute", 
//         top: -1, 
//         right: -1, 
//         width: 20, 
//         height: 20, 
//         borderTopWidth: 3, 
//         borderRightWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerBottomLeft: { 
//         position: "absolute", 
//         bottom: -1, 
//         left: -1, 
//         width: 20, 
//         height: 20, 
//         borderBottomWidth: 3, 
//         borderLeftWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerBottomRight: { 
//         position: "absolute", 
//         bottom: -1, 
//         right: -1, 
//         width: 20, 
//         height: 20, 
//         borderBottomWidth: 3, 
//         borderRightWidth: 3, 
//         borderColor: "white" 
//     },

//     crosshair: { 
//         position: "absolute", 
//         alignItems: "center", 
//         justifyContent: "center", 
//         opacity: 0.5 
//     },
//     crosshairVertical: { 
//         width: 1, 
//         height: 15, 
//         backgroundColor: "white" 
//     },
//     crosshairHorizontal: { 
//         width: 15, 
//         height: 1, 
//         backgroundColor: "white", 
//         position: "absolute" 
//     },

//     resizeHandleTopArea: { 
//         position: "absolute", 
//         top: -20, 
//         left: 0, 
//         right: 0, 
//         height: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleBottomArea: { 
//         position: "absolute", 
//         bottom: -20, 
//         left: 0, 
//         right: 0, 
//         height: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleLeftArea: { 
//         position: "absolute", 
//         left: -20, 
//         top: 0, 
//         bottom: 0, 
//         width: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleRightArea: { 
//         position: "absolute", 
//         right: -20, 
//         top: 0, 
//         bottom: 0, 
//         width: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },

//     resizeHandleVisualHorizontal: { 
//         width: 40, 
//         height: 4, 
//         backgroundColor: "rgba(255,255,255,0.8)", 
//         borderRadius: 2 
//     },
//     resizeHandleVisualVertical: { 
//         width: 4, 
//         height: 40, 
//         backgroundColor: "rgba(255,255,255,0.8)", 
//         borderRadius: 2 
//     },

//     scannerText: { 
//         color: "white", 
//         fontSize: 18, 
//         fontWeight: "600",
//         marginTop: 30, 
//         textAlign: "center", 
//         textShadowColor: "black", 
//         textShadowRadius: 5 
//     },
//     scannerSubtext: {
//         color: "rgba(255,255,255,0.7)", 
//         fontSize: 14, 
//         marginTop: 8, 
//         textAlign: "center", 
//         textShadowColor: "black", 
//         textShadowRadius: 3
//     },

//     cameraControls: { 
//         position: "absolute", 
//         bottom: 40, 
//         left: 0, 
//         right: 0, 
//         alignItems: "center" 
//     },
//     captureButton: { 
//         width: 70, 
//         height: 70, 
//         borderRadius: 35, 
//         backgroundColor: "rgba(255,255,255,0.3)", 
//         alignItems: "center", 
//         justifyContent: "center" 
//     },
//     captureButtonDisabled: { 
//         opacity: 0.3 
//     },
//     captureButtonInner: { 
//         width: 60, 
//         height: 60, 
//         borderRadius: 30, 
//         backgroundColor: "white" 
//     },

//     processingIndicator: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(0,0,0,0.7)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 100,
//     },
//     processingText: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginTop: 20,
//         textAlign: 'center'
//     },
//     processingSubtext: {
//         color: 'rgba(255,255,255,0.7)',
//         fontSize: 14,
//         marginTop: 8,
//         textAlign: 'center'
//     },
    
//     outsideSwipeArea: { 
//         position: "absolute", 
//         top: 0, 
//         left: 0, 
//         right: 0, 
//         bottom: "40%", 
//         backgroundColor: "transparent", 
//         zIndex: 1999 
//     },
//     closeButton: { 
//         position: "absolute", 
//         top: 50, 
//         right: 20, 
//         zIndex: 2002 
//     },
//     closeButtonBackground: { 
//         width: 40, 
//         height: 40, 
//         borderRadius: 20, 
//         backgroundColor: "rgba(0, 0, 0, 0.5)", 
//         alignItems: "center", 
//         justifyContent: "center" 
//     },
//     closeButtonText: { 
//         color: "white", 
//         fontSize: 24, 
//         fontWeight: "bold", 
//         marginTop: -2 
//     },

//     solutionsContainer: { 
//         position: "absolute", 
//         bottom: 0, 
//         left: 0, 
//         right: 0, 
//         backgroundColor: "white", 
//         borderTopLeftRadius: 20, 
//         borderTopRightRadius: 20, 
//         maxHeight: `${Math.floor(BOTTOM_PANEL_RATIO * 100)}%`, 
//         zIndex: 2000 
//     },
//     overlaySwipeArea: { 
//         position: "absolute", 
//         top: 0, 
//         left: 0, 
//         right: 0, 
//         height: 60, 
//         backgroundColor: "transparent", 
//         zIndex: 2001 
//     },
//     swipeIndicator: { 
//         alignItems: "center", 
//         paddingTop: 8, 
//         paddingBottom: 8, 
//         zIndex: 2001 
//     },
//     swipeLine: { 
//         width: 40, 
//         height: 4, 
//         backgroundColor: "#ccc", 
//         borderRadius: 2 
//     },
//     solutionsScroll: { 
//         flex: 1 
//     },
//     scrollContent: { 
//         padding: 16, 
//         paddingTop: 0 
//     },

//     solutionWidget: { 
//         backgroundColor: "#f8f9fa", 
//         borderRadius: 12, 
//         padding: 20, 
//         marginBottom: 16, 
//         elevation: 3, 
//         shadowColor: "#000", 
//         shadowOffset: { width: 0, height: 2 }, 
//         shadowOpacity: 0.1, 
//         shadowRadius: 4 
//     },
//     methodTitle: { 
//         fontSize: 18, 
//         fontWeight: "bold", 
//         color: "#2c3e50", 
//         marginBottom: 12 
//     },
//     formulasContainer: { 
//         backgroundColor: "white", 
//         padding: 12, 
//         borderRadius: 8, 
//         marginBottom: 12 
//     },
//     formulasLabel: { 
//         fontSize: 14, 
//         fontWeight: "bold", 
//         color: "#2c3e50", 
//         marginBottom: 8 
//     },
//     formulaText: { 
//         fontSize: 14, 
//         color: "#2c3e50", 
//         fontFamily: "monospace", 
//         marginBottom: 6, 
//         lineHeight: 18 
//     },
//     answerContainer: { 
//         backgroundColor: "#E3F2FD", 
//         padding: 12, 
//         borderRadius: 8, 
//         marginBottom: 12, 
//         borderLeftWidth: 4, 
//         borderLeftColor: "#2196F3" 
//     },
//     answerLabel: {
//         fontSize: 14,
//         fontWeight: "bold",
//         color: "#1976D2",
//         marginBottom: 4
//     },
//     answerText: { 
//         fontSize: 16, 
//         fontWeight: "bold", 
//         color: "#1976D2", 
//         textAlign: "left" 
//     },
//     stepsButton: { 
//         backgroundColor: "#2196F3", 
//         paddingVertical: 12, 
//         paddingHorizontal: 20, 
//         borderRadius: 8, 
//         alignItems: "center" 
//     },
//     stepsButtonText: { 
//         color: "white", 
//         fontSize: 14, 
//         fontWeight: "600" 
//     }
// });







// import React, { useRef, useState, useEffect } from "react";
// import {
//     StyleSheet,
//     View,
//     Text,
//     TouchableOpacity,
//     Alert,
//     ScrollView,
//     Animated,
//     PanResponder,
//     Image,
//     Dimensions,
//     Platform,
//     Easing,
//     ActivityIndicator
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// const BOTTOM_PANEL_RATIO = 0.45;
// const TOP_AVAILABLE_RATIO = 1 - BOTTOM_PANEL_RATIO;
// const TOP_MARGIN = Platform.OS === "android" ? 24 : 34;
// const MAX_FRAME_HEIGHT = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN - 8;

// // Адрес твоего локального Python-сервера
// const SERVER_URL = `http://192.168.0.11:5000/solve`;

// // Интерфейсы для структуры данных
// interface SolutionMethod {
//     title: string;
//     answer: string;
//     formulas: string[];
//     steps: string[];
// }

// export default function PhysicsSolver() {
//     const [permission, requestPermission] = useCameraPermissions();
//     const cameraRef = useRef<CameraView>(null);
//     const frameRef = useRef<View>(null); 

//     const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//     const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
//     const [showSolutions, setShowSolutions] = useState(false);
//     const [isScrolledToTop, setIsScrolledToTop] = useState(true);
    
//     // Состояние для хранения данных от сервера
//     const [collectedData, setCollectedData] = useState<{ methods: SolutionMethod[] }>({ methods: [] });
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

//     // Анимация виджетов (снизу вверх)
//     const initialPanelTranslate = Math.floor(SCREEN_HEIGHT * BOTTOM_PANEL_RATIO);
//     const slideAnim = useRef(new Animated.Value(initialPanelTranslate)).current;
    
//     // Анимация рамки (от центра к верху)
//     const moveFrameAnim = useRef(new Animated.Value(0)).current;

//     // Храним координаты для анимации
//     const [sourceRect, setSourceRect] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
//     const [targetRect, setTargetRect] = useState<{ x: number, y: number } | null>(null);

//     const [frameSize, setFrameSize] = useState({
//         width: Math.min(300, SCREEN_WIDTH - 40),
//         height: Math.min(200, MAX_FRAME_HEIGHT)
//     });
//     const initialFrameSize = useRef({ ...frameSize });

//     // Проверка статуса сервера при загрузке
//     useEffect(() => {
//         checkServerStatus();
//     }, []);

//     const checkServerStatus = async () => {
//         try {
//             const response = await fetch(SERVER_URL.replace('/solve', '/status'), {
//                 method: 'GET',
//                 timeout: 5000
//             });
//             const result = await response.json();
            
//             if (result.success) {
//                 setServerStatus('online');
//                 console.log('✅ Сервер работает, Chrome подключен');
//             } else {
//                 setServerStatus('offline');
//                 console.log('❌ Сервер недоступен или Chrome не подключен');
//             }
//         } catch (error) {
//             setServerStatus('offline');
//             console.log('❌ Не удалось подключиться к серверу');
//         }
//     };

//     // ------------------- ЖЕСТЫ И РЕСАЙЗ -------------------
//     const swipePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx),
//             onPanResponderMove: (_, g) => {
//                 if (g.dy > 0) slideAnim.setValue(g.dy);
//             },
//             onPanResponderRelease: (_, g) => {
//                 if (g.dy > 80) {
//                     handleCloseWithAlert();
//                 } else {
//                     Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
//                 }
//             }
//         })
//     ).current;

//     const MIN_SIZE = 100;
//     const MAX_WIDTH = SCREEN_WIDTH - 40;
//     const MAX_HEIGHT = MAX_FRAME_HEIGHT;

//     const handleResizeStart = () => {
//         initialFrameSize.current = { ...frameSize };
//     };

//     const topResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newHeight = Math.min(
//                     MAX_HEIGHT,
//                     Math.max(MIN_SIZE, initialFrameSize.current.height - g.dy * 2)
//                 );
//                 setFrameSize((p) => ({ ...p, height: newHeight }));
//             }
//         })
//     ).current;

//     const bottomResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newHeight = Math.min(
//                     MAX_HEIGHT,
//                     Math.max(MIN_SIZE, initialFrameSize.current.height + g.dy * 2)
//                 );
//                 setFrameSize((p) => ({ ...p, height: newHeight }));
//             }
//         })
//     ).current;

//     const leftResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - g.dx * 2));
//                 setFrameSize((p) => ({ ...p, width: newWidth }));
//             }
//         })
//     ).current;

//     const rightResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + g.dx * 2));
//                 setFrameSize((p) => ({ ...p, width: newWidth }));
//             }
//         })
//     ).current;

//     // ------------------- ИСПРАВЛЕННАЯ ЛОГИКА ФОТОГРАФИРОВАНИЯ -------------------
//     const takePicture = async () => {
//         if (!cameraRef.current || !frameRef.current) return;
        
//         // Проверяем статус сервера перед съемкой
//         if (serverStatus === 'offline') {
//             Alert.alert(
//                 "Сервер недоступен", 
//                 "Проверьте:\n1. Запущен ли server.py на компьютере\n2. Запущен ли Chrome через start_chrome.bat\n3. Правильный ли IP-адрес в настройках",
//                 [{ text: "Понятно" }]
//             );
//             return;
//         }

//         setIsTakingPhoto(true);
//         setIsProcessing(true); 

//         try {
//             let currentSourceRect = null as { x: number, y: number, width: number, height: number } | null;

//             // Получаем координаты рамки
//             await new Promise<void>((resolve, reject) => {
//                 if (!frameRef.current) {
//                     reject(new Error("Frame ref not available"));
//                     return;
//                 }

//                 // @ts-ignore
//                 frameRef.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
//                     currentSourceRect = { x: px, y: py, width, height };
//                     setSourceRect(currentSourceRect);

//                     const availableHeight = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN;
//                     const targetY = TOP_MARGIN + (availableHeight - height) / 2;
//                     const targetX = (SCREEN_WIDTH - width) / 2;
                    
//                     setTargetRect({ x: targetX, y: targetY });
//                     resolve();
//                 });
//             });

//             if (!currentSourceRect) {
//                 throw new Error("Не удалось измерить позицию рамки.");
//             }

//             // Делаем фото
//             console.log("📸 Делаем фото...");
//             const photo = await cameraRef.current.takePictureAsync({ 
//                 skipProcessing: false,
//                 base64: true,
//                 quality: 0.8,
//                 exif: false
//             });
            
//             if (!photo || !photo.base64) {
//                 throw new Error("Камера не вернула фото в base64");
//             }

//             setCapturedPhoto(photo.uri);
//             console.log("✅ Фото сделано, отправляем на сервер...");

//             // ОТПРАВЛЯЕМ КООРДИНАТЫ РАМКИ ДЛЯ ОБРЕЗКИ
//             const requestData = {
//                 image: photo.base64,
//                 frame_rect: {
//                     x: currentSourceRect.x,
//                     y: currentSourceRect.y, 
//                     width: currentSourceRect.width,
//                     height: currentSourceRect.height
//                 },
//                 screen_width: SCREEN_WIDTH,
//                 screen_height: SCREEN_HEIGHT
//             };

//             // Отправляем на сервер с таймаутом
//             const controller = new AbortController();
//             const timeoutId = setTimeout(() => controller.abort(), 120000);

//             const response = await fetch(SERVER_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(requestData),
//                 signal: controller.signal
//             });

//             clearTimeout(timeoutId);

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const result = await response.json();
//             console.log("📡 Ответ от сервера:", result);

//             // Обрабатываем ответ
//             if (result && result.success && Array.isArray(result.solutions)) {
//                 setCollectedData({ methods: result.solutions });
//                 console.log(`✅ Получено ${result.solutions.length} решений`);
//             } else {
//                 throw new Error(result.message || "Сервер не вернул решения");
//             }

//             // Запускаем анимации успеха
//             setTimeout(() => {
//                 setIsTakingPhoto(false);
//                 setIsProcessing(false); 
//                 setShowSolutions(true);
                
//                 Animated.parallel([
//                     Animated.timing(slideAnim, { 
//                         toValue: 0, 
//                         duration: 420, 
//                         useNativeDriver: true,
//                         easing: Easing.out(Easing.cubic) 
//                     }),
//                     Animated.timing(moveFrameAnim, {
//                         toValue: 1,
//                         duration: 420,
//                         useNativeDriver: true,
//                         easing: Easing.out(Easing.cubic) 
//                     })
//                 ]).start();
//             }, 100);

//         } catch (err: any) {
//             console.error("❌ Ошибка:", err);
            
//             let errorMessage = "Неизвестная ошибка";
//             if (err.name === 'AbortError') {
//                 errorMessage = "Таймаут запроса (2 минуты). Проверьте сервер и DeepSeek.";
//             } else if (err.message) {
//                 errorMessage = err.message;
//             }

//             Alert.alert(
//                 "Ошибка", 
//                 `${errorMessage}\n\nПроверьте:\n• Запущен ли server.py\n• Вошли ли в DeepSeek в Chrome\n• Стабильно ли интернет-соединение`
//             );
            
//             setIsTakingPhoto(false);
//             setIsProcessing(false);
//             setCapturedPhoto(null);
//             setSourceRect(null); 
//             setTargetRect(null);
//         }
//     };

//     const handleCloseSolutions = () => {
//         Animated.parallel([
//             Animated.timing(slideAnim, { toValue: initialPanelTranslate, duration: 250, useNativeDriver: true }),
//             Animated.timing(moveFrameAnim, { toValue: 0, duration: 250, useNativeDriver: true })
//         ]).start(() => {
//             setShowSolutions(false);
//             setCapturedPhoto(null);
//             setSourceRect(null);
//             setTargetRect(null);
//             setCollectedData({ methods: [] });
//         });
//     };

//     const handleCloseWithAlert = () => {
//         Alert.alert("Вернуться?", "Хотите вернуться к камере?", [
//             {
//                 text: "Отмена",
//                 style: "cancel",
//                 onPress: () => Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start()
//             },
//             { text: "Да", onPress: handleCloseSolutions }
//         ]);
//     };

//     const handleShowSteps = (index: number) => {
//         if (collectedData.methods[index] && collectedData.methods[index].steps) {
//             Alert.alert(
//                 collectedData.methods[index].title, 
//                 collectedData.methods[index].steps.join("\n\n"),
//                 [{ text: "Закрыть", style: "cancel" }]
//             );
//         }
//     };

//     const handleScroll = (e: any) => {
//         setIsScrolledToTop(e.nativeEvent.contentOffset.y <= 10);
//     };

//     const retryServerConnection = () => {
//         setServerStatus('checking');
//         checkServerStatus();
//     };

//     // ------------------- РЕНДЕР ИНДИКАТОРА СТАТУСА -------------------
//     const renderStatusIndicator = () => {
//         if (serverStatus === 'checking') {
//             return (
//                 <View style={styles.statusContainer}>
//                     <ActivityIndicator size="small" color="#666" />
//                     <Text style={styles.statusText}>Проверка сервера...</Text>
//                 </View>
//             );
//         }

//         if (serverStatus === 'offline') {
//             return (
//                 <TouchableOpacity style={styles.statusContainer} onPress={retryServerConnection}>
//                     <View style={[styles.statusDot, { backgroundColor: '#ff4444' }]} />
//                     <Text style={[styles.statusText, { color: '#ff4444' }]}>Сервер недоступен</Text>
//                     <Text style={styles.retryText}>Нажмите для повторной проверки</Text>
//                 </TouchableOpacity>
//             );
//         }

//         return (
//             <View style={styles.statusContainer}>
//                 <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
//                 <Text style={[styles.statusText, { color: '#4CAF50' }]}>Сервер доступен</Text>
//             </View>
//         );
//     };

//     // ------------------- РЕНДЕР РЕЗУЛЬТАТА -------------------
//     const renderAnimatedResult = () => {
//         if (!capturedPhoto || !sourceRect || !targetRect) return null;

//         const translateY = moveFrameAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [sourceRect.y, targetRect.y]
//         });

//         const translateX = moveFrameAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [sourceRect.x, targetRect.x]
//         });

//         return (
//             <View style={[StyleSheet.absoluteFill, { backgroundColor: "#222" }]}> 
//                 <Animated.View
//                     style={{
//                         position: "absolute",
//                         width: sourceRect.width,
//                         height: sourceRect.height,
//                         transform: [{ translateX }, { translateY }],
//                         overflow: "hidden", 
//                         borderRadius: 4, 
//                         borderWidth: 0, 
//                         zIndex: 10
//                     }}
//                 >
//                     <Image
//                         source={{ uri: capturedPhoto }}
//                         style={{
//                             position: "absolute",
//                             width: SCREEN_WIDTH,
//                             height: SCREEN_HEIGHT,
//                             top: -sourceRect.y,
//                             left: -sourceRect.x,
//                         }}
//                         resizeMode="cover"
//                     />
                    
//                     <View style={[StyleSheet.absoluteFill, { borderWidth: 2, borderColor: 'white', borderRadius: 4 }]} />
//                 </Animated.View>
                
//                 {isProcessing && (
//                     <View style={styles.processingIndicator}>
//                         <ActivityIndicator size="large" color="#ffffff" />
//                         <Text style={styles.processingText}>Отправляем задачу в DeepSeek...</Text>
//                         <Text style={styles.processingSubtext}>Это может занять 1-2 минуты</Text>
//                     </View>
//                 )}
//             </View>
//         );
//     };

//     // ------------------- РЕНДЕР КАМЕРЫ -------------------
//     const renderCameraContent = () => {
//         return (
//             <View style={styles.camera}>
//                 <View style={styles.scannerOverlay}>
//                     {/* Индикатор статуса сервера */}
//                     {renderStatusIndicator()}

//                     <View
//                         ref={frameRef}
//                         style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}
//                     >
//                         <View style={styles.cornerTopLeft} />
//                         <View style={styles.cornerTopRight} />
//                         <View style={styles.cornerBottomLeft} />
//                         <View style={styles.cornerBottomRight} />

//                         {!isTakingPhoto && !capturedPhoto && !showSolutions && (
//                             <>
//                                 <View {...topResizePanResponder.panHandlers} style={styles.resizeHandleTopArea}>
//                                     <View style={styles.resizeHandleVisualHorizontal} />
//                                 </View>
//                                 <View {...bottomResizePanResponder.panHandlers} style={styles.resizeHandleBottomArea}>
//                                     <View style={styles.resizeHandleVisualHorizontal} />
//                                 </View>
//                                 <View {...leftResizePanResponder.panHandlers} style={styles.resizeHandleLeftArea}>
//                                     <View style={styles.resizeHandleVisualVertical} />
//                                 </View>
//                                 <View {...rightResizePanResponder.panHandlers} style={styles.resizeHandleRightArea}>
//                                     <View style={styles.resizeHandleVisualVertical} />
//                                 </View>
//                             </>
//                         )}

//                         <View style={styles.crosshair}>
//                             <View style={styles.crosshairVertical} />
//                             <View style={styles.crosshairHorizontal} />
//                         </View>
//                     </View>

//                     <Text style={styles.scannerText}>Наведите рамку на физическую задачу</Text>
//                     <Text style={styles.scannerSubtext}>Убедитесь, что текст хорошо виден</Text>
//                 </View>

//                 <View style={styles.cameraControls}>
//                     {!capturedPhoto && (
//                         <TouchableOpacity
//                             style={[
//                                 styles.captureButton, 
//                                 (isTakingPhoto || serverStatus === 'offline') && styles.captureButtonDisabled
//                             ]}
//                             onPress={takePicture}
//                             disabled={isTakingPhoto || serverStatus === 'offline'} 
//                         >
//                             <View style={styles.captureButtonInner} />
//                         </TouchableOpacity>
//                     )}
//                 </View>
//             </View>
//         );
//     };

//     if (!permission) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#2E86AB" />
//                 <Text style={styles.loadingText}>Загрузка разрешений...</Text>
//             </View>
//         );
//     }

//     if (!permission.granted) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.permissionText}>Нужен доступ к камере</Text>
//                 <Text style={styles.permissionSubtext}>Для работы приложения необходимо разрешение на использование камеры</Text>
//                 <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//                     <Text style={styles.permissionButtonText}>Разрешить использование камеры</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {capturedPhoto ? (
//                 renderAnimatedResult()
//             ) : (
//                 <CameraView 
//                     ref={cameraRef} 
//                     style={styles.camera} 
//                     facing="back"
//                 >
//                     {renderCameraContent()}
//                 </CameraView>
//             )}

//             {showSolutions && <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />}

//             {showSolutions && (
//                 <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
//                     <View style={styles.closeButtonBackground}>
//                         <Text style={styles.closeButtonText}>×</Text>
//                     </View>
//                 </TouchableOpacity>
//             )}

//             {showSolutions && (
//                 <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }], zIndex: 2000 }]}>
//                     {isScrolledToTop && <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />}

//                     <View style={styles.swipeIndicator}>
//                         <View style={styles.swipeLine} />
//                     </View>

//                     <ScrollView 
//                         style={styles.solutionsScroll} 
//                         contentContainerStyle={styles.scrollContent} 
//                         showsVerticalScrollIndicator={false} 
//                         onScroll={handleScroll} 
//                         scrollEventThrottle={16}
//                     >
//                         {collectedData.methods.length > 0 ? (
//                             collectedData.methods.map((m, i) => (
//                                 <View key={i} style={styles.solutionWidget}>
//                                     <Text style={styles.methodTitle}>{m.title}</Text>

//                                     <View style={styles.formulasContainer}>
//                                         <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                                         {m.formulas.map((f, fi) => (
//                                             <Text key={fi} style={styles.formulaText}>
//                                                 {f}
//                                             </Text>
//                                         ))}
//                                     </View>

//                                     <View style={styles.answerContainer}>
//                                         <Text style={styles.answerLabel}>Ответ:</Text>
//                                         <Text style={styles.answerText}>{m.answer}</Text>
//                                     </View>

//                                     <TouchableOpacity style={styles.stepsButton} onPress={() => handleShowSteps(i)}>
//                                         <Text style={styles.stepsButtonText}>📋 Показать шаги решения</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             ))
//                         ) : (
//                             <View style={styles.solutionWidget}>
//                                 <Text style={styles.methodTitle}>Решение не найдено</Text>
//                                 <Text style={styles.formulasLabel}>
//                                     DeepSeek не смог обработать задачу. Попробуйте:
//                                 </Text>
//                                 <Text style={styles.formulaText}>
//                                     • Сфотографировать более четко{"\n"}
//                                     • Убедиться, что задача физическая{"\n"}
//                                     • Проверить подключение к интернету
//                                 </Text>
//                                 <TouchableOpacity style={styles.stepsButton} onPress={handleCloseSolutions}>
//                                     <Text style={styles.stepsButtonText}>⟲ Попробовать снова</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         )}
//                     </ScrollView>
//                 </Animated.View>
//             )}
//         </View>
//     );
// }

// // ------------------- СТИЛИ -------------------
// const styles = StyleSheet.create({
//     container: { 
//         flex: 1, 
//         backgroundColor: "black" 
//     },
//     loadingText: {
//         color: "white", 
//         fontSize: 16, 
//         textAlign: "center", 
//         marginTop: 20
//     },

//     // Статус сервера
//     statusContainer: {
//         position: 'absolute',
//         top: Platform.OS === 'ios' ? 60 : 40,
//         left: 20,
//         right: 20,
//         backgroundColor: 'rgba(0,0,0,0.7)',
//         padding: 12,
//         borderRadius: 8,
//         flexDirection: 'row',
//         alignItems: 'center',
//         zIndex: 100
//     },
//     statusDot: {
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         marginRight: 8
//     },
//     statusText: {
//         color: 'white',
//         fontSize: 14,
//         fontWeight: '600'
//     },
//     retryText: {
//         color: 'rgba(255,255,255,0.7)',
//         fontSize: 12,
//         marginLeft: 'auto'
//     },

//     // Разрешения камеры
//     permissionText: { 
//         color: "white", 
//         fontSize: 22, 
//         fontWeight: "bold",
//         textAlign: "center", 
//         marginBottom: 12 
//     },
//     permissionSubtext: {
//         color: "rgba(255,255,255,0.8)", 
//         fontSize: 16, 
//         textAlign: "center", 
//         marginBottom: 30,
//         paddingHorizontal: 20,
//         lineHeight: 22
//     },
//     permissionButton: { 
//         backgroundColor: "#2E86AB", 
//         paddingHorizontal: 30, 
//         paddingVertical: 16, 
//         borderRadius: 12 
//     },
//     permissionButtonText: { 
//         color: "white", 
//         fontSize: 18, 
//         fontWeight: "600" 
//     },

//     camera: { 
//         flex: 1 
//     },

//     scannerOverlay: { 
//         flex: 1, 
//         alignItems: "center", 
//         justifyContent: "center", 
//         paddingBottom: 100 
//     },
//     scannerFrame: {
//         borderWidth: 0,
//         borderColor: "rgba(255,255,255,0.3)",
//         backgroundColor: "transparent",
//         alignItems: "center",
//         justifyContent: "center"
//     },

//     cornerTopLeft: { 
//         position: "absolute", 
//         top: -1, 
//         left: -1, 
//         width: 20, 
//         height: 20, 
//         borderTopWidth: 3, 
//         borderLeftWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerTopRight: { 
//         position: "absolute", 
//         top: -1, 
//         right: -1, 
//         width: 20, 
//         height: 20, 
//         borderTopWidth: 3, 
//         borderRightWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerBottomLeft: { 
//         position: "absolute", 
//         bottom: -1, 
//         left: -1, 
//         width: 20, 
//         height: 20, 
//         borderBottomWidth: 3, 
//         borderLeftWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerBottomRight: { 
//         position: "absolute", 
//         bottom: -1, 
//         right: -1, 
//         width: 20, 
//         height: 20, 
//         borderBottomWidth: 3, 
//         borderRightWidth: 3, 
//         borderColor: "white" 
//     },

//     crosshair: { 
//         position: "absolute", 
//         alignItems: "center", 
//         justifyContent: "center", 
//         opacity: 0.5 
//     },
//     crosshairVertical: { 
//         width: 1, 
//         height: 15, 
//         backgroundColor: "white" 
//     },
//     crosshairHorizontal: { 
//         width: 15, 
//         height: 1, 
//         backgroundColor: "white", 
//         position: "absolute" 
//     },

//     resizeHandleTopArea: { 
//         position: "absolute", 
//         top: -20, 
//         left: 0, 
//         right: 0, 
//         height: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleBottomArea: { 
//         position: "absolute", 
//         bottom: -20, 
//         left: 0, 
//         right: 0, 
//         height: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleLeftArea: { 
//         position: "absolute", 
//         left: -20, 
//         top: 0, 
//         bottom: 0, 
//         width: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleRightArea: { 
//         position: "absolute", 
//         right: -20, 
//         top: 0, 
//         bottom: 0, 
//         width: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },

//     resizeHandleVisualHorizontal: { 
//         width: 40, 
//         height: 4, 
//         backgroundColor: "rgba(255,255,255,0.8)", 
//         borderRadius: 2 
//     },
//     resizeHandleVisualVertical: { 
//         width: 4, 
//         height: 40, 
//         backgroundColor: "rgba(255,255,255,0.8)", 
//         borderRadius: 2 
//     },

//     scannerText: { 
//         color: "white", 
//         fontSize: 18, 
//         fontWeight: "600",
//         marginTop: 30, 
//         textAlign: "center", 
//         textShadowColor: "black", 
//         textShadowRadius: 5 
//     },
//     scannerSubtext: {
//         color: "rgba(255,255,255,0.7)", 
//         fontSize: 14, 
//         marginTop: 8, 
//         textAlign: "center", 
//         textShadowColor: "black", 
//         textShadowRadius: 3
//     },

//     cameraControls: { 
//         position: "absolute", 
//         bottom: 40, 
//         left: 0, 
//         right: 0, 
//         alignItems: "center" 
//     },
//     captureButton: { 
//         width: 70, 
//         height: 70, 
//         borderRadius: 35, 
//         backgroundColor: "rgba(255,255,255,0.3)", 
//         alignItems: "center", 
//         justifyContent: "center" 
//     },
//     captureButtonDisabled: { 
//         opacity: 0.3 
//     },
//     captureButtonInner: { 
//         width: 60, 
//         height: 60, 
//         borderRadius: 30, 
//         backgroundColor: "white" 
//     },

//     processingIndicator: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(0,0,0,0.7)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 100,
//     },
//     processingText: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginTop: 20,
//         textAlign: 'center'
//     },
//     processingSubtext: {
//         color: 'rgba(255,255,255,0.7)',
//         fontSize: 14,
//         marginTop: 8,
//         textAlign: 'center'
//     },
    
//     outsideSwipeArea: { 
//         position: "absolute", 
//         top: 0, 
//         left: 0, 
//         right: 0, 
//         bottom: "40%", 
//         backgroundColor: "transparent", 
//         zIndex: 1999 
//     },
//     closeButton: { 
//         position: "absolute", 
//         top: 50, 
//         right: 20, 
//         zIndex: 2002 
//     },
//     closeButtonBackground: { 
//         width: 40, 
//         height: 40, 
//         borderRadius: 20, 
//         backgroundColor: "rgba(0, 0, 0, 0.5)", 
//         alignItems: "center", 
//         justifyContent: "center" 
//     },
//     closeButtonText: { 
//         color: "white", 
//         fontSize: 24, 
//         fontWeight: "bold", 
//         marginTop: -2 
//     },

//     solutionsContainer: { 
//         position: "absolute", 
//         bottom: 0, 
//         left: 0, 
//         right: 0, 
//         backgroundColor: "white", 
//         borderTopLeftRadius: 20, 
//         borderTopRightRadius: 20, 
//         maxHeight: `${Math.floor(BOTTOM_PANEL_RATIO * 100)}%`, 
//         zIndex: 2000 
//     },
//     overlaySwipeArea: { 
//         position: "absolute", 
//         top: 0, 
//         left: 0, 
//         right: 0, 
//         height: 60, 
//         backgroundColor: "transparent", 
//         zIndex: 2001 
//     },
//     swipeIndicator: { 
//         alignItems: "center", 
//         paddingTop: 8, 
//         paddingBottom: 8, 
//         zIndex: 2001 
//     },
//     swipeLine: { 
//         width: 40, 
//         height: 4, 
//         backgroundColor: "#ccc", 
//         borderRadius: 2 
//     },
//     solutionsScroll: { 
//         flex: 1 
//     },
//     scrollContent: { 
//         padding: 16, 
//         paddingTop: 0 
//     },

//     solutionWidget: { 
//         backgroundColor: "#f8f9fa", 
//         borderRadius: 12, 
//         padding: 20, 
//         marginBottom: 16, 
//         elevation: 3, 
//         shadowColor: "#000", 
//         shadowOffset: { width: 0, height: 2 }, 
//         shadowOpacity: 0.1, 
//         shadowRadius: 4 
//     },
//     methodTitle: { 
//         fontSize: 18, 
//         fontWeight: "bold", 
//         color: "#2c3e50", 
//         marginBottom: 12 
//     },
//     formulasContainer: { 
//         backgroundColor: "white", 
//         padding: 12, 
//         borderRadius: 8, 
//         marginBottom: 12 
//     },
//     formulasLabel: { 
//         fontSize: 14, 
//         fontWeight: "bold", 
//         color: "#2c3e50", 
//         marginBottom: 8 
//     },
//     formulaText: { 
//         fontSize: 14, 
//         color: "#2c3e50", 
//         fontFamily: "monospace", 
//         marginBottom: 6, 
//         lineHeight: 18 
//     },
//     answerContainer: { 
//         backgroundColor: "#E3F2FD", 
//         padding: 12, 
//         borderRadius: 8, 
//         marginBottom: 12, 
//         borderLeftWidth: 4, 
//         borderLeftColor: "#2196F3" 
//     },
//     answerLabel: {
//         fontSize: 14,
//         fontWeight: "bold",
//         color: "#1976D2",
//         marginBottom: 4
//     },
//     answerText: { 
//         fontSize: 16, 
//         fontWeight: "bold", 
//         color: "#1976D2", 
//         textAlign: "left" 
//     },
//     stepsButton: { 
//         backgroundColor: "#2196F3", 
//         paddingVertical: 12, 
//         paddingHorizontal: 20, 
//         borderRadius: 8, 
//         alignItems: "center" 
//     },
//     stepsButtonText: { 
//         color: "white", 
//         fontSize: 14, 
//         fontWeight: "600" 
//     }
// });

















// import React, { useRef, useState, useEffect } from "react";
// import {
//     StyleSheet,
//     View,
//     Text,
//     TouchableOpacity,
//     Alert,
//     ScrollView,
//     Animated,
//     PanResponder,
//     Image,
//     Dimensions,
//     Platform,
//     Easing,
//     ActivityIndicator
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// const BOTTOM_PANEL_RATIO = 0.45;
// const TOP_AVAILABLE_RATIO = 1 - BOTTOM_PANEL_RATIO;
// const TOP_MARGIN = Platform.OS === "android" ? 24 : 34;
// const MAX_FRAME_HEIGHT = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN - 8;

// // Адрес твоего локального Python-сервера
// const SERVER_URL = `http://192.168.0.11:5000/solve`;

// // Интерфейсы для структуры данных
// interface SolutionMethod {
//     title: string;
//     answer: string;
//     formulas: string[];
//     steps: string[];
// }

// export default function PhysicsSolver() {
//     const [permission, requestPermission] = useCameraPermissions();
//     const cameraRef = useRef<CameraView>(null);
//     const frameRef = useRef<View>(null); 

//     const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//     const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
//     const [showSolutions, setShowSolutions] = useState(false);
//     const [isScrolledToTop, setIsScrolledToTop] = useState(true);
    
//     // Состояние для хранения данных от сервера
//     const [collectedData, setCollectedData] = useState<{ methods: SolutionMethod[] }>({ methods: [] });
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

//     // Анимация виджетов (снизу вверх)
//     const initialPanelTranslate = Math.floor(SCREEN_HEIGHT * BOTTOM_PANEL_RATIO);
//     const slideAnim = useRef(new Animated.Value(initialPanelTranslate)).current;
    
//     // Анимация рамки (от центра к верху)
//     const moveFrameAnim = useRef(new Animated.Value(0)).current;

//     // Храним координаты для анимации
//     const [sourceRect, setSourceRect] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
//     const [targetRect, setTargetRect] = useState<{ x: number, y: number } | null>(null);

//     const [frameSize, setFrameSize] = useState({
//         width: Math.min(300, SCREEN_WIDTH - 40),
//         height: Math.min(200, MAX_FRAME_HEIGHT)
//     });
//     const initialFrameSize = useRef({ ...frameSize });

//     // Проверка статуса сервера при загрузке
//     useEffect(() => {
//         checkServerStatus();
//     }, []);

//     const checkServerStatus = async () => {
//         try {
//             const response = await fetch(SERVER_URL.replace('/solve', '/status'), {
//                 method: 'GET',
//                 timeout: 5000
//             });
//             const result = await response.json();
            
//             if (result.success) {
//                 setServerStatus('online');
//                 console.log('✅ Сервер работает, Chrome подключен');
//             } else {
//                 setServerStatus('offline');
//                 console.log('❌ Сервер недоступен или Chrome не подключен');
//             }
//         } catch (error) {
//             setServerStatus('offline');
//             console.log('❌ Не удалось подключиться к серверу');
//         }
//     };

//     // ------------------- ЖЕСТЫ И РЕСАЙЗ -------------------
//     const swipePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx),
//             onPanResponderMove: (_, g) => {
//                 if (g.dy > 0) slideAnim.setValue(g.dy);
//             },
//             onPanResponderRelease: (_, g) => {
//                 if (g.dy > 80) {
//                     handleCloseWithAlert();
//                 } else {
//                     Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
//                 }
//             }
//         })
//     ).current;

//     const MIN_SIZE = 100;
//     const MAX_WIDTH = SCREEN_WIDTH - 40;
//     const MAX_HEIGHT = MAX_FRAME_HEIGHT;

//     const handleResizeStart = () => {
//         initialFrameSize.current = { ...frameSize };
//     };

//     const topResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newHeight = Math.min(
//                     MAX_HEIGHT,
//                     Math.max(MIN_SIZE, initialFrameSize.current.height - g.dy * 2)
//                 );
//                 setFrameSize((p) => ({ ...p, height: newHeight }));
//             }
//         })
//     ).current;

//     const bottomResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newHeight = Math.min(
//                     MAX_HEIGHT,
//                     Math.max(MIN_SIZE, initialFrameSize.current.height + g.dy * 2)
//                 );
//                 setFrameSize((p) => ({ ...p, height: newHeight }));
//             }
//         })
//     ).current;

//     const leftResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - g.dx * 2));
//                 setFrameSize((p) => ({ ...p, width: newWidth }));
//             }
//         })
//     ).current;

//     const rightResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + g.dx * 2));
//                 setFrameSize((p) => ({ ...p, width: newWidth }));
//             }
//         })
//     ).current;

//     // ------------------- ИСПРАВЛЕННАЯ ЛОГИКА ФОТОГРАФИРОВАНИЯ -------------------
//     const takePicture = async () => {
//         if (!cameraRef.current || !frameRef.current) return;
        
//         // Проверяем статус сервера перед съемкой
//         if (serverStatus === 'offline') {
//             Alert.alert(
//                 "Сервер недоступен", 
//                 "Проверьте:\n1. Запущен ли server.py на компьютере\n2. Запущен ли Chrome через start_chrome.bat\n3. Правильный ли IP-адрес в настройках",
//                 [{ text: "Понятно" }]
//             );
//             return;
//         }

//         setIsTakingPhoto(true);
//         setIsProcessing(true); 

//         try {
//             let currentSourceRect = null as { x: number, y: number, width: number, height: number } | null;

//             // Получаем координаты рамки
//             await new Promise<void>((resolve, reject) => {
//                 if (!frameRef.current) {
//                     reject(new Error("Frame ref not available"));
//                     return;
//                 }

//                 // @ts-ignore
//                 frameRef.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
//                     currentSourceRect = { x: px, y: py, width, height };
//                     setSourceRect(currentSourceRect);

//                     const availableHeight = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN;
//                     const targetY = TOP_MARGIN + (availableHeight - height) / 2;
//                     const targetX = (SCREEN_WIDTH - width) / 2;
                    
//                     setTargetRect({ x: targetX, y: targetY });
//                     resolve();
//                 });
//             });

//             if (!currentSourceRect) {
//                 throw new Error("Не удалось измерить позицию рамки.");
//             }

//             // Делаем фото
//             console.log("📸 Делаем фото...");
//             const photo = await cameraRef.current.takePictureAsync({ 
//                 skipProcessing: false,
//                 base64: true,
//                 quality: 0.8,
//                 exif: false
//             });
            
//             if (!photo || !photo.base64) {
//                 throw new Error("Камера не вернула фото в base64");
//             }

//             setCapturedPhoto(photo.uri);
//             console.log("✅ Фото сделано, отправляем на сервер...");

//             // ОТПРАВЛЯЕМ КООРДИНАТЫ РАМКИ ДЛЯ ОБРЕЗКИ
//             const requestData = {
//                 image: photo.base64,
//                 frame_rect: {
//                     x: currentSourceRect.x,
//                     y: currentSourceRect.y, 
//                     width: currentSourceRect.width,
//                     height: currentSourceRect.height
//                 },
//                 screen_width: SCREEN_WIDTH,
//                 screen_height: SCREEN_HEIGHT
//             };

//             // Отправляем на сервер с таймаутом
//             const controller = new AbortController();
//             const timeoutId = setTimeout(() => controller.abort(), 120000);

//             const response = await fetch(SERVER_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(requestData),
//                 signal: controller.signal
//             });

//             clearTimeout(timeoutId);

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const result = await response.json();
//             console.log("📡 Ответ от сервера:", result);

//             // Обрабатываем ответ
//             if (result && result.success && Array.isArray(result.solutions)) {
//                 setCollectedData({ methods: result.solutions });
//                 console.log(`✅ Получено ${result.solutions.length} решений`);
//             } else {
//                 throw new Error(result.message || "Сервер не вернул решения");
//             }

//             // Запускаем анимации успеха
//             setTimeout(() => {
//                 setIsTakingPhoto(false);
//                 setIsProcessing(false); 
//                 setShowSolutions(true);
                
//                 Animated.parallel([
//                     Animated.timing(slideAnim, { 
//                         toValue: 0, 
//                         duration: 420, 
//                         useNativeDriver: true,
//                         easing: Easing.out(Easing.cubic) 
//                     }),
//                     Animated.timing(moveFrameAnim, {
//                         toValue: 1,
//                         duration: 420,
//                         useNativeDriver: true,
//                         easing: Easing.out(Easing.cubic) 
//                     })
//                 ]).start();
//             }, 100);

//         } catch (err: any) {
//             console.error("❌ Ошибка:", err);
            
//             let errorMessage = "Неизвестная ошибка";
//             if (err.name === 'AbortError') {
//                 errorMessage = "Таймаут запроса (2 минуты). Проверьте сервер и DeepSeek.";
//             } else if (err.message) {
//                 errorMessage = err.message;
//             }

//             Alert.alert(
//                 "Ошибка", 
//                 `${errorMessage}\n\nПроверьте:\n• Запущен ли server.py\n• Вошли ли в DeepSeek в Chrome\n• Стабильно ли интернет-соединение`
//             );
            
//             setIsTakingPhoto(false);
//             setIsProcessing(false);
//             setCapturedPhoto(null);
//             setSourceRect(null); 
//             setTargetRect(null);
//         }
//     };

//     const handleCloseSolutions = () => {
//         Animated.parallel([
//             Animated.timing(slideAnim, { toValue: initialPanelTranslate, duration: 250, useNativeDriver: true }),
//             Animated.timing(moveFrameAnim, { toValue: 0, duration: 250, useNativeDriver: true })
//         ]).start(() => {
//             setShowSolutions(false);
//             setCapturedPhoto(null);
//             setSourceRect(null);
//             setTargetRect(null);
//             setCollectedData({ methods: [] });
//         });
//     };

//     const handleCloseWithAlert = () => {
//         Alert.alert("Вернуться?", "Хотите вернуться к камере?", [
//             {
//                 text: "Отмена",
//                 style: "cancel",
//                 onPress: () => Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start()
//             },
//             { text: "Да", onPress: handleCloseSolutions }
//         ]);
//     };

//     const handleShowSteps = (index: number) => {
//         if (collectedData.methods[index] && collectedData.methods[index].steps) {
//             const stepsText = collectedData.methods[index].steps.join("\n\n");
//             Alert.alert(
//                 `📋 ${collectedData.methods[index].title}`,
//                 stepsText,
//                 [
//                     { text: "Закрыть", style: "cancel" },
//                     { text: "Скопировать", onPress: () => {
//                         // Здесь можно добавить логику копирования
//                         console.log("Шаги скопированы");
//                     }}
//                 ]
//             );
//         }
//     };

//     const handleShowFormulas = (index: number) => {
//         if (collectedData.methods[index] && collectedData.methods[index].formulas) {
//             const formulasText = collectedData.methods[index].formulas.join("\n\n");
//             Alert.alert(
//                 `📐 Формулы: ${collectedData.methods[index].title}`,
//                 formulasText,
//                 [
//                     { text: "Закрыть", style: "cancel" },
//                     { text: "Показать решение", onPress: () => handleShowSteps(index) }
//                 ]
//             );
//         }
//     };

//     const handleScroll = (e: any) => {
//         setIsScrolledToTop(e.nativeEvent.contentOffset.y <= 10);
//     };

//     const retryServerConnection = () => {
//         setServerStatus('checking');
//         checkServerStatus();
//     };

//     // ------------------- РЕНДЕР ИНДИКАТОРА СТАТУСА -------------------
//     const renderStatusIndicator = () => {
//         if (serverStatus === 'checking') {
//             return (
//                 <View style={styles.statusContainer}>
//                     <ActivityIndicator size="small" color="#666" />
//                     <Text style={styles.statusText}>Проверка сервера...</Text>
//                 </View>
//             );
//         }

//         if (serverStatus === 'offline') {
//             return (
//                 <TouchableOpacity style={styles.statusContainer} onPress={retryServerConnection}>
//                     <View style={[styles.statusDot, { backgroundColor: '#ff4444' }]} />
//                     <Text style={[styles.statusText, { color: '#ff4444' }]}>Сервер недоступен</Text>
//                     <Text style={styles.retryText}>Нажмите для повторной проверки</Text>
//                 </TouchableOpacity>
//             );
//         }

//         return (
//             <View style={styles.statusContainer}>
//                 <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
//                 <Text style={[styles.statusText, { color: '#4CAF50' }]}>Сервер доступен</Text>
//             </View>
//         );
//     };

//     // ------------------- РЕНДЕР РЕЗУЛЬТАТА -------------------
//     const renderAnimatedResult = () => {
//         if (!capturedPhoto || !sourceRect || !targetRect) return null;

//         const translateY = moveFrameAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [sourceRect.y, targetRect.y]
//         });

//         const translateX = moveFrameAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [sourceRect.x, targetRect.x]
//         });

//         return (
//             <View style={[StyleSheet.absoluteFill, { backgroundColor: "#222" }]}> 
//                 <Animated.View
//                     style={{
//                         position: "absolute",
//                         width: sourceRect.width,
//                         height: sourceRect.height,
//                         transform: [{ translateX }, { translateY }],
//                         overflow: "hidden", 
//                         borderRadius: 4, 
//                         borderWidth: 0, 
//                         zIndex: 10
//                     }}
//                 >
//                     <Image
//                         source={{ uri: capturedPhoto }}
//                         style={{
//                             position: "absolute",
//                             width: SCREEN_WIDTH,
//                             height: SCREEN_HEIGHT,
//                             top: -sourceRect.y,
//                             left: -sourceRect.x,
//                         }}
//                         resizeMode="cover"
//                     />
                    
//                     <View style={[StyleSheet.absoluteFill, { borderWidth: 2, borderColor: 'white', borderRadius: 4 }]} />
//                 </Animated.View>
                
//                 {isProcessing && (
//                     <View style={styles.processingIndicator}>
//                         <ActivityIndicator size="large" color="#ffffff" />
//                         <Text style={styles.processingText}>Отправляем задачу в DeepSeek...</Text>
//                         <Text style={styles.processingSubtext}>Это может занять 1-2 минуты</Text>
//                     </View>
//                 )}
//             </View>
//         );
//     };

//     // ------------------- РЕНДЕР КАМЕРЫ -------------------
//     const renderCameraContent = () => {
//         return (
//             <View style={styles.camera}>
//                 <View style={styles.scannerOverlay}>
//                     {/* Индикатор статуса сервера */}
//                     {renderStatusIndicator()}

//                     <View
//                         ref={frameRef}
//                         style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}
//                     >
//                         <View style={styles.cornerTopLeft} />
//                         <View style={styles.cornerTopRight} />
//                         <View style={styles.cornerBottomLeft} />
//                         <View style={styles.cornerBottomRight} />

//                         {!isTakingPhoto && !capturedPhoto && !showSolutions && (
//                             <>
//                                 <View {...topResizePanResponder.panHandlers} style={styles.resizeHandleTopArea}>
//                                     <View style={styles.resizeHandleVisualHorizontal} />
//                                 </View>
//                                 <View {...bottomResizePanResponder.panHandlers} style={styles.resizeHandleBottomArea}>
//                                     <View style={styles.resizeHandleVisualHorizontal} />
//                                 </View>
//                                 <View {...leftResizePanResponder.panHandlers} style={styles.resizeHandleLeftArea}>
//                                     <View style={styles.resizeHandleVisualVertical} />
//                                 </View>
//                                 <View {...rightResizePanResponder.panHandlers} style={styles.resizeHandleRightArea}>
//                                     <View style={styles.resizeHandleVisualVertical} />
//                                 </View>
//                             </>
//                         )}

//                         <View style={styles.crosshair}>
//                             <View style={styles.crosshairVertical} />
//                             <View style={styles.crosshairHorizontal} />
//                         </View>
//                     </View>

//                     <Text style={styles.scannerText}>Наведите рамку на физическую задачу</Text>
//                     <Text style={styles.scannerSubtext}>Убедитесь, что текст хорошо виден</Text>
//                 </View>

//                 <View style={styles.cameraControls}>
//                     {!capturedPhoto && (
//                         <TouchableOpacity
//                             style={[
//                                 styles.captureButton, 
//                                 (isTakingPhoto || serverStatus === 'offline') && styles.captureButtonDisabled
//                             ]}
//                             onPress={takePicture}
//                             disabled={isTakingPhoto || serverStatus === 'offline'} 
//                         >
//                             <View style={styles.captureButtonInner} />
//                         </TouchableOpacity>
//                     )}
//                 </View>
//             </View>
//         );
//     };

//     if (!permission) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#2E86AB" />
//                 <Text style={styles.loadingText}>Загрузка разрешений...</Text>
//             </View>
//         );
//     }

//     if (!permission.granted) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.permissionText}>Нужен доступ к камере</Text>
//                 <Text style={styles.permissionSubtext}>Для работы приложения необходимо разрешение на использование камеры</Text>
//                 <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//                     <Text style={styles.permissionButtonText}>Разрешить использование камеры</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {capturedPhoto ? (
//                 renderAnimatedResult()
//             ) : (
//                 <CameraView 
//                     ref={cameraRef} 
//                     style={styles.camera} 
//                     facing="back"
//                 >
//                     {renderCameraContent()}
//                 </CameraView>
//             )}

//             {showSolutions && <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />}

//             {showSolutions && (
//                 <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
//                     <View style={styles.closeButtonBackground}>
//                         <Text style={styles.closeButtonText}>×</Text>
//                     </View>
//                 </TouchableOpacity>
//             )}

//             {showSolutions && (
//                 <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }], zIndex: 2000 }]}>
//                     {isScrolledToTop && <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />}

//                     <View style={styles.swipeIndicator}>
//                         <View style={styles.swipeLine} />
//                     </View>

//                     <ScrollView 
//                         style={styles.solutionsScroll} 
//                         contentContainerStyle={styles.scrollContent} 
//                         showsVerticalScrollIndicator={false} 
//                         onScroll={handleScroll} 
//                         scrollEventThrottle={16}
//                     >
//                         <View style={styles.resultsHeader}>
//                             <Text style={styles.resultsTitle}>Найдено решений: {collectedData.methods.length}</Text>
//                         </View>

//                         {collectedData.methods.length > 0 ? (
//                             collectedData.methods.map((method, index) => (
//                                 <View key={index} style={styles.solutionWidget}>
//                                     {/* ЗАГОЛОВОК ВИДЖЕТА */}
//                                     <Text style={styles.methodTitle}>{method.title}</Text>

//                                     {/* КНОПКА ФОРМУЛ */}
//                                     {method.formulas && method.formulas.length > 0 && (
//                                         <TouchableOpacity 
//                                             style={styles.formulasButton} 
//                                             onPress={() => handleShowFormulas(index)}
//                                         >
//                                             <Text style={styles.formulasButtonText}>
//                                                 📐 Показать формулы ({method.formulas.length})
//                                             </Text>
//                                         </TouchableOpacity>
//                                     )}

//                                     {/* ОТВЕТ */}
//                                     <View style={styles.answerContainer}>
//                                         <Text style={styles.answerLabel}>Ответ:</Text>
//                                         <Text style={styles.answerText}>{method.answer}</Text>
//                                     </View>

//                                     {/* КНОПКА РЕШЕНИЯ */}
//                                     <TouchableOpacity 
//                                         style={styles.stepsButton} 
//                                         onPress={() => handleShowSteps(index)}
//                                     >
//                                         <Text style={styles.stepsButtonText}>
//                                             📋 Показать пошаговое решение
//                                         </Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             ))
//                         ) : (
//                             <View style={styles.solutionWidget}>
//                                 <Text style={styles.methodTitle}>Решение не найдено</Text>
//                                 <Text style={styles.formulasLabel}>
//                                     DeepSeek не смог обработать задачу. Попробуйте:
//                                 </Text>
//                                 <Text style={styles.formulaText}>
//                                     • Сфотографировать более четко{"\n"}
//                                     • Убедиться, что задача физическая{"\n"}
//                                     • Проверить подключение к интернету
//                                 </Text>
//                                 <TouchableOpacity style={styles.stepsButton} onPress={handleCloseSolutions}>
//                                     <Text style={styles.stepsButtonText}>⟲ Попробовать снова</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         )}
//                     </ScrollView>
//                 </Animated.View>
//             )}
//         </View>
//     );
// }

// // ------------------- СТИЛИ -------------------
// const styles = StyleSheet.create({
//     container: { 
//         flex: 1, 
//         backgroundColor: "black" 
//     },
//     loadingText: {
//         color: "white", 
//         fontSize: 16, 
//         textAlign: "center", 
//         marginTop: 20
//     },

//     // Статус сервера
//     statusContainer: {
//         position: 'absolute',
//         top: Platform.OS === 'ios' ? 60 : 40,
//         left: 20,
//         right: 20,
//         backgroundColor: 'rgba(0,0,0,0.7)',
//         padding: 12,
//         borderRadius: 8,
//         flexDirection: 'row',
//         alignItems: 'center',
//         zIndex: 100
//     },
//     statusDot: {
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         marginRight: 8
//     },
//     statusText: {
//         color: 'white',
//         fontSize: 14,
//         fontWeight: '600'
//     },
//     retryText: {
//         color: 'rgba(255,255,255,0.7)',
//         fontSize: 12,
//         marginLeft: 'auto'
//     },

//     // Разрешения камеры
//     permissionText: { 
//         color: "white", 
//         fontSize: 22, 
//         fontWeight: "bold",
//         textAlign: "center", 
//         marginBottom: 12 
//     },
//     permissionSubtext: {
//         color: "rgba(255,255,255,0.8)", 
//         fontSize: 16, 
//         textAlign: "center", 
//         marginBottom: 30,
//         paddingHorizontal: 20,
//         lineHeight: 22
//     },
//     permissionButton: { 
//         backgroundColor: "#2E86AB", 
//         paddingHorizontal: 30, 
//         paddingVertical: 16, 
//         borderRadius: 12 
//     },
//     permissionButtonText: { 
//         color: "white", 
//         fontSize: 18, 
//         fontWeight: "600" 
//     },

//     camera: { 
//         flex: 1 
//     },

//     scannerOverlay: { 
//         flex: 1, 
//         alignItems: "center", 
//         justifyContent: "center", 
//         paddingBottom: 100 
//     },
//     scannerFrame: {
//         borderWidth: 0,
//         borderColor: "rgba(255,255,255,0.3)",
//         backgroundColor: "transparent",
//         alignItems: "center",
//         justifyContent: "center"
//     },

//     cornerTopLeft: { 
//         position: "absolute", 
//         top: -1, 
//         left: -1, 
//         width: 20, 
//         height: 20, 
//         borderTopWidth: 3, 
//         borderLeftWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerTopRight: { 
//         position: "absolute", 
//         top: -1, 
//         right: -1, 
//         width: 20, 
//         height: 20, 
//         borderTopWidth: 3, 
//         borderRightWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerBottomLeft: { 
//         position: "absolute", 
//         bottom: -1, 
//         left: -1, 
//         width: 20, 
//         height: 20, 
//         borderBottomWidth: 3, 
//         borderLeftWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerBottomRight: { 
//         position: "absolute", 
//         bottom: -1, 
//         right: -1, 
//         width: 20, 
//         height: 20, 
//         borderBottomWidth: 3, 
//         borderRightWidth: 3, 
//         borderColor: "white" 
//     },

//     crosshair: { 
//         position: "absolute", 
//         alignItems: "center", 
//         justifyContent: "center", 
//         opacity: 0.5 
//     },
//     crosshairVertical: { 
//         width: 1, 
//         height: 15, 
//         backgroundColor: "white" 
//     },
//     crosshairHorizontal: { 
//         width: 15, 
//         height: 1, 
//         backgroundColor: "white", 
//         position: "absolute" 
//     },

//     resizeHandleTopArea: { 
//         position: "absolute", 
//         top: -20, 
//         left: 0, 
//         right: 0, 
//         height: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleBottomArea: { 
//         position: "absolute", 
//         bottom: -20, 
//         left: 0, 
//         right: 0, 
//         height: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleLeftArea: { 
//         position: "absolute", 
//         left: -20, 
//         top: 0, 
//         bottom: 0, 
//         width: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleRightArea: { 
//         position: "absolute", 
//         right: -20, 
//         top: 0, 
//         bottom: 0, 
//         width: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },

//     resizeHandleVisualHorizontal: { 
//         width: 40, 
//         height: 4, 
//         backgroundColor: "rgba(255,255,255,0.8)", 
//         borderRadius: 2 
//     },
//     resizeHandleVisualVertical: { 
//         width: 4, 
//         height: 40, 
//         backgroundColor: "rgba(255,255,255,0.8)", 
//         borderRadius: 2 
//     },

//     scannerText: { 
//         color: "white", 
//         fontSize: 18, 
//         fontWeight: "600",
//         marginTop: 30, 
//         textAlign: "center", 
//         textShadowColor: "black", 
//         textShadowRadius: 5 
//     },
//     scannerSubtext: {
//         color: "rgba(255,255,255,0.7)", 
//         fontSize: 14, 
//         marginTop: 8, 
//         textAlign: "center", 
//         textShadowColor: "black", 
//         textShadowRadius: 3
//     },

//     cameraControls: { 
//         position: "absolute", 
//         bottom: 40, 
//         left: 0, 
//         right: 0, 
//         alignItems: "center" 
//     },
//     captureButton: { 
//         width: 70, 
//         height: 70, 
//         borderRadius: 35, 
//         backgroundColor: "rgba(255,255,255,0.3)", 
//         alignItems: "center", 
//         justifyContent: "center" 
//     },
//     captureButtonDisabled: { 
//         opacity: 0.3 
//     },
//     captureButtonInner: { 
//         width: 60, 
//         height: 60, 
//         borderRadius: 30, 
//         backgroundColor: "white" 
//     },

//     processingIndicator: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(0,0,0,0.7)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 100,
//     },
//     processingText: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginTop: 20,
//         textAlign: 'center'
//     },
//     processingSubtext: {
//         color: 'rgba(255,255,255,0.7)',
//         fontSize: 14,
//         marginTop: 8,
//         textAlign: 'center'
//     },
    
//     outsideSwipeArea: { 
//         position: "absolute", 
//         top: 0, 
//         left: 0, 
//         right: 0, 
//         bottom: "40%", 
//         backgroundColor: "transparent", 
//         zIndex: 1999 
//     },
//     closeButton: { 
//         position: "absolute", 
//         top: 50, 
//         right: 20, 
//         zIndex: 2002 
//     },
//     closeButtonBackground: { 
//         width: 40, 
//         height: 40, 
//         borderRadius: 20, 
//         backgroundColor: "rgba(0, 0, 0, 0.5)", 
//         alignItems: "center", 
//         justifyContent: "center" 
//     },
//     closeButtonText: { 
//         color: "white", 
//         fontSize: 24, 
//         fontWeight: "bold", 
//         marginTop: -2 
//     },

//     solutionsContainer: { 
//         position: "absolute", 
//         bottom: 0, 
//         left: 0, 
//         right: 0, 
//         backgroundColor: "white", 
//         borderTopLeftRadius: 20, 
//         borderTopRightRadius: 20, 
//         maxHeight: `${Math.floor(BOTTOM_PANEL_RATIO * 100)}%`, 
//         zIndex: 2000 
//     },
//     overlaySwipeArea: { 
//         position: "absolute", 
//         top: 0, 
//         left: 0, 
//         right: 0, 
//         height: 60, 
//         backgroundColor: "transparent", 
//         zIndex: 2001 
//     },
//     swipeIndicator: { 
//         alignItems: "center", 
//         paddingTop: 8, 
//         paddingBottom: 8, 
//         zIndex: 2001 
//     },
//     swipeLine: { 
//         width: 40, 
//         height: 4, 
//         backgroundColor: "#ccc", 
//         borderRadius: 2 
//     },
//     solutionsScroll: { 
//         flex: 1 
//     },
//     scrollContent: { 
//         padding: 16, 
//         paddingTop: 0 
//     },

//     resultsHeader: {
//         padding: 16,
//         backgroundColor: '#f1f8ff',
//         marginBottom: 12,
//         borderRadius: 8,
//         borderLeftWidth: 4,
//         borderLeftColor: '#2196F3'
//     },
//     resultsTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#1976D2',
//         textAlign: 'center'
//     },

//     solutionWidget: { 
//         backgroundColor: "#f8f9fa", 
//         borderRadius: 12, 
//         padding: 20, 
//         marginBottom: 16, 
//         elevation: 3, 
//         shadowColor: "#000", 
//         shadowOffset: { width: 0, height: 2 }, 
//         shadowOpacity: 0.1, 
//         shadowRadius: 4 
//     },
//     methodTitle: { 
//         fontSize: 18, 
//         fontWeight: "bold", 
//         color: "#2c3e50", 
//         marginBottom: 16,
//         textAlign: 'center'
//     },

//     formulasButton: {
//         backgroundColor: "#4CAF50",
//         paddingVertical: 12,
//         paddingHorizontal: 16,
//         borderRadius: 8,
//         marginBottom: 12,
//         alignItems: "center"
//     },
//     formulasButtonText: {
//         color: "white",
//         fontSize: 14,
//         fontWeight: "600"
//     },

//     answerContainer: { 
//         backgroundColor: "#E3F2FD", 
//         padding: 16, 
//         borderRadius: 8, 
//         marginBottom: 16, 
//         borderLeftWidth: 4, 
//         borderLeftColor: "#2196F3" 
//     },
//     answerLabel: {
//         fontSize: 14,
//         fontWeight: "bold",
//         color: "#1976D2",
//         marginBottom: 8
//     },
//     answerText: { 
//         fontSize: 18, 
//         fontWeight: "bold", 
//         color: "#1976D2", 
//         textAlign: "center" 
//     },

//     stepsButton: { 
//         backgroundColor: "#2196F3", 
//         paddingVertical: 14,
//         paddingHorizontal: 20, 
//         borderRadius: 8, 
//         alignItems: "center" 
//     },
//     stepsButtonText: { 
//         color: "white", 
//         fontSize: 16, 
//         fontWeight: "600" 
//     },

//     formulasLabel: { 
//         fontSize: 14, 
//         fontWeight: "bold", 
//         color: "#2c3e50", 
//         marginBottom: 8 
//     },
//     formulaText: { 
//         fontSize: 14, 
//         color: "#2c3e50", 
//         fontFamily: "monospace", 
//         marginBottom: 6, 
//         lineHeight: 18 
//     },
// });




// import os
// import json
// import base64
// import re
// import time
// from flask import Flask, request, jsonify
// from flask_cors import CORS
// from playwright.sync_api import sync_playwright
// from PIL import Image
// import io

// # --- КОНСТАНТЫ ---
// TEMP_IMAGE_FILE = 'temp_image.jpg'
// TEMP_CROPPED_FILE = 'temp_cropped.jpg'
// TIMEOUT_MS = 180000

// PROMPT_TEXT = """
// РЕШИ ЭТУ ФИЗИЧЕСКУЮ ЗАДАЧУ И ВЕРНИ ОТВЕТ В ФОРМАТЕ JSON:

// {
//     "solutions": [
//         {
//             "title": "Название метода",
//             "formulas": ["формула1", "формула2"],
//             "answer": "конечный ответ",
//             "steps": ["шаг1", "шаг2", "шаг3"]
//         }
//     ]
// }

// ВАЖНО: Верни ТОЛЬКО JSON без лишнего текста
// """

// app = Flask(__name__)
// CORS(app)

// def debug_print(message):
//     timestamp = time.strftime("%H:%M:%S")
//     print(f"[{timestamp}] {message}")

// def crop_image_to_frame(image_data, frame_rect, screen_width, screen_height):
//     """Обрезает изображение до области рамки"""
//     try:
//         debug_print("✂️ Обрезаем изображение по рамке...")
        
//         # Открываем изображение из base64
//         image = Image.open(io.BytesIO(image_data))
        
//         # Получаем размеры оригинального изображения
//         img_width, img_height = image.size
//         debug_print(f"📐 Размеры изображения: {img_width}x{img_height}")
//         debug_print(f"📐 Размеры экрана: {screen_width}x{screen_height}")
//         debug_print(f"📐 Координаты рамки: x={frame_rect['x']}, y={frame_rect['y']}, width={frame_rect['width']}, height={frame_rect['height']}")
        
//         # Вычисляем соотношение размеров
//         scale_x = img_width / screen_width
//         scale_y = img_height / screen_height
        
//         # Масштабируем координаты рамки под размер изображения
//         left = int(frame_rect['x'] * scale_x)
//         top = int(frame_rect['y'] * scale_y)
//         right = int((frame_rect['x'] + frame_rect['width']) * scale_x)
//         bottom = int((frame_rect['y'] + frame_rect['height']) * scale_y)
        
//         # Проверяем границы
//         left = max(0, min(left, img_width))
//         top = max(0, min(top, img_height))
//         right = max(0, min(right, img_width))
//         bottom = max(0, min(bottom, img_height))
        
//         debug_print(f"📐 Область обрезки: left={left}, top={top}, right={right}, bottom={bottom}")
        
//         # Обрезаем изображение
//         cropped_image = image.crop((left, top, right, bottom))
        
//         # Сохраняем обрезанное изображение во временный файл
//         cropped_image.save(TEMP_CROPPED_FILE, 'JPEG', quality=85)
//         debug_print(f"✅ Изображение обрезано: {TEMP_CROPPED_FILE}")
        
//         return TEMP_CROPPED_FILE
        
//     except Exception as e:
//         debug_print(f"❌ Ошибка обрезки изображения: {e}")
//         return None

// def get_deepseek_response(image_path):
//     debug_print("🚀 Запускаем DeepSeek с Playwright...")
    
//     try:
//         with sync_playwright() as p:
//             debug_print("🔗 Подключаемся к Chrome на порту 9222...")
//             browser = p.chromium.connect_over_cdp("http://localhost:9222")
            
//             context = browser.contexts[0]
//             if not context.pages:
//                 return None, "В Chrome нет открытых вкладок"
                
//             page = context.pages[0]
//             debug_print(f"📄 Работаем с вкладкой: {page.title()}")
            
//             current_url = page.url
//             if "deepseek.com" not in current_url:
//                 debug_print("🌐 Переходим на DeepSeek...")
//                 page.goto("https://chat.deepseek.com", wait_until="networkidle")
//                 time.sleep(5)
            
//             debug_print("⏳ Ждем загрузки интерфейса DeepSeek...")
//             page.wait_for_selector('textarea', timeout=20000)
            
//             # ШАГ 1: ЗАГРУЖАЕМ ИЗОБРАЖЕНИЕ (УЛУЧШЕННАЯ ЛОГИКА)
//             debug_print("🖼️ Загружаем изображение...")
//             try:
//                 # Пробуем разные селекторы для поля загрузки файлов
//                 file_selectors = [
//                     'input[type="file"]',
//                     '[data-testid="file-upload"]',
//                     'button[aria-label*="upload"]',
//                     'button[aria-label*="file"]',
//                     'button:has-text("Upload")',
//                     'button:has-text("Загрузить")'
//                 ]
                
//                 file_input = None
//                 for selector in file_selectors:
//                     file_input = page.query_selector(selector)
//                     if file_input:
//                         debug_print(f"✅ Найдено поле для загрузки: {selector}")
//                         break
                
//                 if file_input:
//                     # Загружаем изображение
//                     file_input.set_input_files(image_path)
//                     debug_print("✅ Изображение загружено")
                    
//                     # Ждем обработки изображения
//                     time.sleep(5)
                    
//                     # Проверяем, что изображение загрузилось
//                     try:
//                         page.wait_for_selector('img[src*="blob:"], img[alt*="upload"], [class*="image"]', timeout=10000)
//                         debug_print("✅ Изображение отображается на странице")
//                     except:
//                         debug_print("⚠️ Изображение не отображается, но продолжаем...")
//                 else:
//                     debug_print("❌ Не найдено поле для загрузки файлов")
//                     # Пробуем перетаскивание
//                     debug_print("🔄 Пробуем перетаскивание...")
//                     page.dispatch_event('body', 'drop', {
//                         'dataTransfer': {'files': [image_path]}
//                     })
//                     time.sleep(3)
                    
//             except Exception as e:
//                 debug_print(f"❌ Ошибка загрузки изображения: {e}")
//                 return None, f"Ошибка загрузки изображения: {e}"
            
//             # ШАГ 2: ВВОДИМ ПРОМПТ
//             debug_print("📝 Вводим промпт...")
//             try:
//                 textarea = page.query_selector('textarea')
//                 if textarea:
//                     # Очищаем поле ввода
//                     textarea.click()
//                     textarea.press('Control+A')
//                     textarea.press('Backspace')
//                     # Вводим наш промпт
//                     textarea.fill(PROMPT_TEXT)
//                     debug_print("✅ Промпт введен")
//                     time.sleep(1)
                    
//                     # ШАГ 3: ОТПРАВЛЯЕМ СООБЩЕНИЕ
//                     debug_print("📤 Отправляем сообщение...")
                    
//                     # Пробуем разные способы отправки
//                     send_button = page.query_selector('button[type="submit"]')
//                     if send_button and send_button.is_enabled():
//                         send_button.click()
//                         debug_print("✅ Сообщение отправлено через кнопку отправки")
//                     else:
//                         # Ищем кнопку по тексту или эмодзи
//                         all_buttons = page.query_selector_all('button')
//                         send_button_found = False
                        
//                         for button in all_buttons:
//                             if button.is_enabled():
//                                 button_text = button.inner_text().lower()
//                                 if any(word in button_text for word in ['send', 'отправ', '➤', '▶', '⏎', '↵']):
//                                     button.click()
//                                     debug_print("✅ Сообщение отправлено через найденную кнопку")
//                                     send_button_found = True
//                                     break
                        
//                         if not send_button_found:
//                             # Старый способ через Enter
//                             textarea.press('Enter')
//                             debug_print("✅ Сообщение отправлено через Enter")
                    
//                 else:
//                     return None, "Не найдено поле для ввода текста"
                    
//             except Exception as e:
//                 debug_print(f"❌ Ошибка ввода текста: {e}")
//                 return None, f"Ошибка ввода текста: {e}"
            
//             # ШАГ 4: ЖДЕМ И ПОЛУЧАЕМ ОТВЕТ
//             debug_print("⏳ Ожидаем ответа DeepSeek...")
            
//             # Ждем генерации (увеличиваем время)
//             time.sleep(30)
            
//             # Получаем ВЕСЬ текст страницы
//             debug_print("🔍 Получаем весь текст страницы...")
//             full_page_text = page.inner_text('body')
            
//             # Ищем JSON в тексте
//             debug_print("🔎 Ищем JSON в тексте...")
            
//             response_text = ""
            
//             # Метод 1: Ищем JSON структуру
//             json_patterns = [
//                 r'\{[^{}]*\{[^{}]*\}[^{}]*\}[^{}]*\}',  # Вложенный JSON
//                 r'\{.*\}',  # Простой JSON
//                 r'\[.*\]',  # JSON массив
//             ]
            
//             for pattern in json_patterns:
//                 json_matches = re.findall(pattern, full_page_text, re.DOTALL)
//                 if json_matches:
//                     # Берем последний (самый свежий) JSON
//                     response_text = json_matches[-1]
//                     debug_print(f"✅ JSON найден через паттерн: {pattern[:50]}...")
//                     debug_print(f"📄 JSON: {response_text[:200]}...")
//                     break
            
//             # Метод 2: Если JSON не найден, ищем текст ответа
//             if not response_text:
//                 debug_print("🔍 Ищем текстовый ответ...")
//                 # Ищем текст после ключевых слов
//                 answer_keywords = ['ответ', 'answer', 'result', 'solution', 'решение']
//                 lines = full_page_text.split('\n')
                
//                 for i, line in enumerate(lines):
//                     line_lower = line.lower()
//                     if any(keyword in line_lower for keyword in answer_keywords):
//                         # Берем несколько строк после ключевого слова
//                         response_text = '\n'.join(lines[i:i+10])
//                         debug_print("✅ Текстовый ответ найден по ключевым словам")
//                         break
            
//             # Метод 3: Если ничего не найдено, берем последние 2000 символов
//             if not response_text:
//                 response_text = full_page_text[-2000:] if len(full_page_text) > 2000 else full_page_text
//                 debug_print("⚠️ Используем конец текста страницы")
            
//             browser.close()
            
//             if response_text:
//                 debug_print(f"🎯 Получен ответ ({len(response_text)} символов)")
//             else:
//                 debug_print("❌ Ответ пустой")
                
//             return response_text, None
            
//     except Exception as e:
//         debug_print(f"❌ Критическая ошибка: {e}")
//         return None, f"Критическая ошибка Playwright: {e}"

// def parse_solutions_from_text(text):
//     if not text:
//         debug_print("❌ Текст для парсинга пустой")
//         return []
    
//     debug_print("🔍 Анализируем ответ DeepSeek...")
    
//     # Пытаемся найти и распарсить JSON
//     try:
//         # Чистим текст от лишних символов
//         clean_text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)
        
//         # Ищем JSON структуру
//         json_match = re.search(r'\{.*\}', clean_text, re.DOTALL)
//         if json_match:
//             json_str = json_match.group(0)
//             debug_print(f"📄 Найден JSON: {json_str[:200]}...")
            
//             try:
//                 # Пробуем распарсить
//                 parsed_data = json.loads(json_str)
//                 if "solutions" in parsed_data and isinstance(parsed_data["solutions"], list):
//                     debug_print(f"✅ Найдено {len(parsed_data['solutions'])} решений в JSON")
//                     return parsed_data["solutions"]
//             except json.JSONDecodeError as e:
//                 debug_print(f"⚠️ Ошибка парсинга JSON: {e}")
//                 # Пробуем почистить JSON
//                 try:
//                     # Убираем лишние запятые
//                     json_str = re.sub(r',\s*\}', '}', json_str)
//                     json_str = re.sub(r',\s*\]', ']', json_str)
//                     parsed_data = json.loads(json_str)
//                     if "solutions" in parsed_data and isinstance(parsed_data["solutions"], list):
//                         debug_print(f"✅ Найдено {len(parsed_data['solutions'])} решений в очищенном JSON")
//                         return parsed_data["solutions"]
//                 except:
//                     debug_print("❌ Не удалось распарсить JSON даже после очистки")
//     except Exception as e:
//         debug_print(f"⚠️ Ошибка поиска JSON: {e}")
    
//     # Запасное решение - ищем ответ в тексте
//     debug_print("🔄 Создаем запасное решение из текста...")
//     lines = [line.strip() for line in text.split('\n') if line.strip()]
    
//     answer = "Ответ не найден"
//     steps = []
//     formulas = []
    
//     # Ищем ответ в тексте по ключевым словам
//     for i, line in enumerate(lines):
//         line_lower = line.lower()
//         if any(word in line_lower for keyword in ['ответ', 'answer', 'result', '='] for word in [keyword]):
//             answer = line
//             # Берем несколько строк после ответа как шаги
//             steps = lines[i+1:i+6] if i+1 < len(lines) else []
//             break
    
//     # Ищем формулы (строки с = или математическими символами)
//     for line in lines:
//         if any(symbol in line for symbol in ['=', '+', '-', '*', '/', '^']) and len(line) < 100:
//             formulas.append(line)
//             if len(formulas) >= 3:  # Ограничиваем количество формул
//                 break
    
//     if not steps:
//         steps = lines[:5] if len(lines) > 5 else lines
    
//     if not formulas:
//         formulas = ["Формулы не найдены"]
    
//     solution = {
//         "title": "Решение задачи",
//         "formulas": formulas,
//         "answer": answer,
//         "steps": steps if steps else ["Подробное решение в тексте ответа"]
//     }
    
//     debug_print(f"✅ Создано запасное решение с ответом: {answer}")
//     return [solution]

// @app.route('/solve', methods=['POST'])
// def solve_problem():
//     debug_print("\n" + "="*50)
//     debug_print("📱 ПОЛУЧЕН ЗАПРОС ОТ ТЕЛЕФОНА")
//     debug_print("="*50)
    
//     try:
//         data = request.get_json()
//         if not data or 'image' not in data:
//             return jsonify({
//                 "success": False, 
//                 "message": "Нет изображения в запросе",
//                 "solutions": []
//             }), 400
        
//         debug_print("💾 Декодируем изображение...")
//         try:
//             image_data = base64.b64decode(data['image'])
//             debug_print(f"✅ Изображение декодировано ({len(image_data)} байт)")
//         except Exception as e:
//             return jsonify({
//                 "success": False, 
//                 "message": f"Ошибка декодирования изображения: {e}",
//                 "solutions": []
//             }), 500
        
//         # ОБРЕЗАЕМ ИЗОБРАЖЕНИЕ ЕСЛИ ЕСТЬ КООРДИНАТЫ РАМКИ
//         image_to_send = None
//         if 'frame_rect' in data and data['frame_rect']:
//             frame_rect = data['frame_rect']
//             screen_width = data.get('screen_width', 360)
//             screen_height = data.get('screen_height', 640)
            
//             cropped_path = crop_image_to_frame(image_data, frame_rect, screen_width, screen_height)
//             if cropped_path:
//                 image_to_send = cropped_path
//                 debug_print("🖼️ Используем обрезанное изображение")
//             else:
//                 with open(TEMP_IMAGE_FILE, 'wb') as f:
//                     f.write(image_data)
//                 image_to_send = TEMP_IMAGE_FILE
//                 debug_print("🖼️ Используем оригинальное изображение (обрезка не удалась)")
//         else:
//             with open(TEMP_IMAGE_FILE, 'wb') as f:
//                 f.write(image_data)
//             image_to_send = TEMP_IMAGE_FILE
//             debug_print("🖼️ Используем оригинальное изображение (нет координат рамки)")
        
//         debug_print("🔄 Отправляем в DeepSeek...")
//         response_text, error = get_deepseek_response(image_to_send)
        
//         # Удаляем временные файлы
//         if os.path.exists(TEMP_IMAGE_FILE):
//             os.remove(TEMP_IMAGE_FILE)
//             debug_print("🗑️ Временный файл удален")
//         if os.path.exists(TEMP_CROPPED_FILE):
//             os.remove(TEMP_CROPPED_FILE)
//             debug_print("🗑️ Обрезанный файл удален")
        
//         if error:
//             debug_print(f"❌ Ошибка: {error}")
//             return jsonify({
//                 "success": False, 
//                 "message": error,
//                 "solutions": []
//             }), 500
        
//         debug_print("🔍 Парсим решения...")
//         solutions = parse_solutions_from_text(response_text)
        
//         if solutions:
//             debug_print(f"✅ Найдено {len(solutions)} решений")
//             return jsonify({
//                 "success": True,
//                 "message": "Решение получено",
//                 "solutions": solutions
//             })
//         else:
//             debug_print("❌ Решения не найдены")
//             return jsonify({
//                 "success": False,
//                 "message": "Не удалось извлечь решения из ответа",
//                 "solutions": []
//             }), 500
            
//     except Exception as e:
//         debug_print(f"💥 Критическая ошибка сервера: {e}")
//         return jsonify({
//             "success": False,
//             "message": f"Внутренняя ошибка сервера: {e}",
//             "solutions": []
//         }), 500

// @app.route('/status', methods=['GET'])
// def server_status():
//     try:
//         with sync_playwright() as p:
//             browser = p.chromium.connect_over_cdp("http://localhost:9222")
//             chrome_connected = browser is not None
//             browser.close()
            
//             return jsonify({
//                 "success": True,
//                 "chrome_connected": chrome_connected,
//                 "message": "Сервер работает, Chrome подключен" if chrome_connected else "Chrome не подключен"
//             })
//     except:
//         return jsonify({
//             "success": False,
//             "chrome_connected": False,
//             "message": "Chrome не запущен на порту 9222"
//         })

// if __name__ == '__main__':
//     debug_print("🚀 Запуск Flask сервера...")
//     debug_print("📍 Сервер будет доступен по адресу: http://192.168.0.11:5000")
//     debug_print("🎯 Улучшенная загрузка изображений в DeepSeek")
//     debug_print("="*50)
    
//     app.run(host='0.0.0.0', port=5000, debug=True)











// import React, { useRef, useState, useEffect } from "react";
// import {
//     StyleSheet,
//     View,
//     Text,
//     TouchableOpacity,
//     Alert,
//     ScrollView,
//     Animated,
//     PanResponder,
//     Image,
//     Dimensions,
//     Platform,
//     Easing,
//     ActivityIndicator
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// const BOTTOM_PANEL_RATIO = 0.45;
// const TOP_AVAILABLE_RATIO = 1 - BOTTOM_PANEL_RATIO;
// const TOP_MARGIN = Platform.OS === "android" ? 24 : 34;
// const MAX_FRAME_HEIGHT = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN - 8;

// // Адрес твоего локального Python-сервера
// const SERVER_URL = `http://192.168.0.11:5000/solve`;

// // Интерфейсы для структуры данных
// interface SolutionMethod {
//     title: string;
//     answer: string;
//     formulas: string[];
//     steps: string[];
// }

// export default function PhysicsSolver() {
//     const [permission, requestPermission] = useCameraPermissions();
//     const cameraRef = useRef<CameraView>(null);
//     const frameRef = useRef<View>(null); 

//     const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//     const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
//     const [showSolutions, setShowSolutions] = useState(false);
//     const [isScrolledToTop, setIsScrolledToTop] = useState(true);
    
//     // Состояние для хранения данных от сервера
//     const [collectedData, setCollectedData] = useState<{ methods: SolutionMethod[] }>({ methods: [] });
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

//     // Анимация виджетов (снизу вверх)
//     const initialPanelTranslate = Math.floor(SCREEN_HEIGHT * BOTTOM_PANEL_RATIO);
//     const slideAnim = useRef(new Animated.Value(initialPanelTranslate)).current;
    
//     // Анимация рамки (от центра к верху)
//     const moveFrameAnim = useRef(new Animated.Value(0)).current;

//     // Храним координаты для анимации
//     const [sourceRect, setSourceRect] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
//     const [targetRect, setTargetRect] = useState<{ x: number, y: number } | null>(null);

//     const [frameSize, setFrameSize] = useState({
//         width: Math.min(300, SCREEN_WIDTH - 40),
//         height: Math.min(200, MAX_FRAME_HEIGHT)
//     });
//     const initialFrameSize = useRef({ ...frameSize });

//     // Проверка статуса сервера при загрузке
//     useEffect(() => {
//         checkServerStatus();
//     }, []);

//     const checkServerStatus = async () => {
//         try {
//             const response = await fetch(SERVER_URL.replace('/solve', '/status'), {
//                 method: 'GET',
//                 timeout: 5000
//             });
//             const result = await response.json();
            
//             if (result.success && result.api_key_valid) {
//                 setServerStatus('online');
//                 console.log('✅ Сервер работает, API ключ действителен');
//             } else {
//                 setServerStatus('offline');
//                 console.log('❌ Сервер недоступен или API ключ недействителен');
//             }
//         } catch (error) {
//             setServerStatus('offline');
//             console.log('❌ Не удалось подключиться к серверу');
//         }
//     };

//     // ------------------- ЖЕСТЫ И РЕСАЙЗ -------------------
//     const swipePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx),
//             onPanResponderMove: (_, g) => {
//                 if (g.dy > 0) slideAnim.setValue(g.dy);
//             },
//             onPanResponderRelease: (_, g) => {
//                 if (g.dy > 80) {
//                     handleCloseWithAlert();
//                 } else {
//                     Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
//                 }
//             }
//         })
//     ).current;

//     const MIN_SIZE = 100;
//     const MAX_WIDTH = SCREEN_WIDTH - 40;
//     const MAX_HEIGHT = MAX_FRAME_HEIGHT;

//     const handleResizeStart = () => {
//         initialFrameSize.current = { ...frameSize };
//     };

//     const topResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newHeight = Math.min(
//                     MAX_HEIGHT,
//                     Math.max(MIN_SIZE, initialFrameSize.current.height - g.dy * 2)
//                 );
//                 setFrameSize((p) => ({ ...p, height: newHeight }));
//             }
//         })
//     ).current;

//     const bottomResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newHeight = Math.min(
//                     MAX_HEIGHT,
//                     Math.max(MIN_SIZE, initialFrameSize.current.height + g.dy * 2)
//                 );
//                 setFrameSize((p) => ({ ...p, height: newHeight }));
//             }
//         })
//     ).current;

//     const leftResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - g.dx * 2));
//                 setFrameSize((p) => ({ ...p, width: newWidth }));
//             }
//         })
//     ).current;

//     const rightResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + g.dx * 2));
//                 setFrameSize((p) => ({ ...p, width: newWidth }));
//             }
//         })
//     ).current;

//     // ------------------- ЛОГИКА ФОТОГРАФИРОВАНИЯ -------------------
//     const takePicture = async () => {
//         if (!cameraRef.current || !frameRef.current) return;
        
//         // Проверяем статус сервера перед съемкой
//         if (serverStatus === 'offline') {
//             Alert.alert(
//                 "Сервер недоступен", 
//                 "Проверьте:\n1. Запущен ли server.py на компьютере\n2. Корректный ли API ключ в server.py\n3. Правильный ли IP-адрес в настройках",
//                 [{ text: "Понятно" }]
//             );
//             return;
//         }

//         setIsTakingPhoto(true);
//         setIsProcessing(true); 

//         try {
//             let currentSourceRect = null as { x: number, y: number, width: number, height: number } | null;

//             // Получаем координаты рамки
//             await new Promise<void>((resolve, reject) => {
//                 if (!frameRef.current) {
//                     reject(new Error("Frame ref not available"));
//                     return;
//                 }

//                 // @ts-ignore
//                 frameRef.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
//                     currentSourceRect = { x: px, y: py, width, height };
//                     setSourceRect(currentSourceRect);

//                     const availableHeight = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN;
//                     const targetY = TOP_MARGIN + (availableHeight - height) / 2;
//                     const targetX = (SCREEN_WIDTH - width) / 2;
                    
//                     setTargetRect({ x: targetX, y: targetY });
//                     resolve();
//                 });
//             });

//             if (!currentSourceRect) {
//                 throw new Error("Не удалось измерить позицию рамки.");
//             }

//             // Делаем фото
//             console.log("📸 Делаем фото...");
//             const photo = await cameraRef.current.takePictureAsync({ 
//                 skipProcessing: false,
//                 base64: true,
//                 quality: 0.8,
//                 exif: false,
//                 mute: true,
//                 });
            
//             if (!photo || !photo.base64) {
//                 throw new Error("Камера не вернула фото в base64");
//             }

//             setCapturedPhoto(photo.uri);
//             console.log("✅ Фото сделано, отправляем на сервер...");

//             // ОТПРАВЛЯЕМ КООРДИНАТЫ РАМКИ ДЛЯ ОБРЕЗКИ
//             const requestData = {
//                 image: photo.base64,
//                 frame_rect: {
//                     x: currentSourceRect.x,
//                     y: currentSourceRect.y, 
//                     width: currentSourceRect.width,
//                     height: currentSourceRect.height
//                 },
//                 screen_width: SCREEN_WIDTH,
//                 screen_height: SCREEN_HEIGHT
//             };

//             // Отправляем на сервер с таймаутом
//             const controller = new AbortController();
//             const timeoutId = setTimeout(() => controller.abort(), 120000);

//             const response = await fetch(SERVER_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(requestData),
//                 signal: controller.signal
//             });

//             clearTimeout(timeoutId);

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const result = await response.json();
//             console.log("📡 Ответ от сервера:", result);

//             // Обрабатываем ответ
//             if (result && result.success && Array.isArray(result.solutions)) {
//                 setCollectedData({ methods: result.solutions });
//                 console.log(`✅ Получено ${result.solutions.length} решений от DeepSeek API`);
//             } else {
//                 throw new Error(result.message || "Сервер не вернул решения");
//             }

//             // Запускаем анимации успеха
//             setTimeout(() => {
//                 setIsTakingPhoto(false);
//                 setIsProcessing(false); 
//                 setShowSolutions(true);
                
//                 Animated.parallel([
//                     Animated.timing(slideAnim, { 
//                         toValue: 0, 
//                         duration: 420, 
//                         useNativeDriver: true,
//                         easing: Easing.out(Easing.cubic) 
//                     }),
//                     Animated.timing(moveFrameAnim, {
//                         toValue: 1,
//                         duration: 420,
//                         useNativeDriver: true,
//                         easing: Easing.out(Easing.cubic) 
//                     })
//                 ]).start();
//             }, 100);

//         } catch (err: any) {
//             console.error("❌ Ошибка:", err);
            
//             let errorMessage = "Неизвестная ошибка";
//             if (err.name === 'AbortError') {
//                 errorMessage = "Таймаут запроса (2 минуты). Проверьте сервер.";
//             } else if (err.message) {
//                 errorMessage = err.message;
//             }

//             Alert.alert(
//                 "Ошибка", 
//                 `${errorMessage}\n\nПроверьте:\n• Запущен ли server.py\n• Корректный ли API ключ\n• Стабильно ли интернет-соединение`
//             );
            
//             setIsTakingPhoto(false);
//             setIsProcessing(false);
//             setCapturedPhoto(null);
//             setSourceRect(null); 
//             setTargetRect(null);
//         }
//     };

//     const handleCloseSolutions = () => {
//         Animated.parallel([
//             Animated.timing(slideAnim, { toValue: initialPanelTranslate, duration: 250, useNativeDriver: true }),
//             Animated.timing(moveFrameAnim, { toValue: 0, duration: 250, useNativeDriver: true })
//         ]).start(() => {
//             setShowSolutions(false);
//             setCapturedPhoto(null);
//             setSourceRect(null);
//             setTargetRect(null);
//             setCollectedData({ methods: [] });
//         });
//     };

//     const handleCloseWithAlert = () => {
//         Alert.alert("Вернуться?", "Хотите вернуться к камере?", [
//             {
//                 text: "Отмена",
//                 style: "cancel",
//                 onPress: () => Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start()
//             },
//             { text: "Да", onPress: handleCloseSolutions }
//         ]);
//     };

//     const handleShowSteps = (index: number) => {
//         if (collectedData.methods[index] && collectedData.methods[index].steps) {
//             Alert.alert(
//                 collectedData.methods[index].title, 
//                 collectedData.methods[index].steps.join("\n\n"),
//                 [{ text: "Закрыть", style: "cancel" }]
//             );
//         }
//     };

//     const handleScroll = (e: any) => {
//         setIsScrolledToTop(e.nativeEvent.contentOffset.y <= 10);
//     };

//     const retryServerConnection = () => {
//         setServerStatus('checking');
//         checkServerStatus();
//     };

//     // ------------------- РЕНДЕР ИНДИКАТОРА СТАТУСА -------------------
//     const renderStatusIndicator = () => {
//         if (serverStatus === 'checking') {
//             return (
//                 <View style={styles.statusContainer}>
//                     <ActivityIndicator size="small" color="#666" />
//                     <Text style={styles.statusText}>Проверка сервера...</Text>
//                 </View>
//             );
//         }

//         if (serverStatus === 'offline') {
//             return (
//                 <TouchableOpacity style={styles.statusContainer} onPress={retryServerConnection}>
//                     <View style={[styles.statusDot, { backgroundColor: '#ff4444' }]} />
//                     <Text style={[styles.statusText, { color: '#ff4444' }]}>Сервер недоступен</Text>
//                     <Text style={styles.retryText}>Нажмите для повторной проверки</Text>
//                 </TouchableOpacity>
//             );
//         }

//         return (
//             <View style={styles.statusContainer}>
//                 <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
//                 <Text style={[styles.statusText, { color: '#4CAF50' }]}>✅ Сервер + API доступны</Text>
//             </View>
//         );
//     };

//     // ------------------- РЕНДЕР РЕЗУЛЬТАТА -------------------
//     const renderAnimatedResult = () => {
//         if (!capturedPhoto || !sourceRect || !targetRect) return null;

//         const translateY = moveFrameAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [sourceRect.y, targetRect.y]
//         });

//         const translateX = moveFrameAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [sourceRect.x, targetRect.x]
//         });

//         return (
//             <View style={[StyleSheet.absoluteFill, { backgroundColor: "#222" }]}> 
//                 <Animated.View
//                     style={{
//                         position: "absolute",
//                         width: sourceRect.width,
//                         height: sourceRect.height,
//                         transform: [{ translateX }, { translateY }],
//                         overflow: "hidden", 
//                         borderRadius: 4, 
//                         borderWidth: 0, 
//                         zIndex: 10
//                     }}
//                 >
//                     <Image
//                         source={{ uri: capturedPhoto }}
//                         style={{
//                             position: "absolute",
//                             width: SCREEN_WIDTH,
//                             height: SCREEN_HEIGHT,
//                             top: -sourceRect.y,
//                             left: -sourceRect.x,
//                         }}
//                         resizeMode="cover"
//                     />
                    
//                     <View style={[StyleSheet.absoluteFill, { borderWidth: 2, borderColor: 'white', borderRadius: 4 }]} />
//                 </Animated.View>
                
//                 {isProcessing && (
//                     <View style={styles.processingIndicator}>
//                         <ActivityIndicator size="large" color="#ffffff" />
//                         <Text style={styles.processingText}>Отправляем задачу в DeepSeek API...</Text>
//                         <Text style={styles.processingSubtext}>Обработка через нейросеть</Text>
//                     </View>
//                 )}
//             </View>
//         );
//     };

//     // ------------------- РЕНДЕР КАМЕРЫ -------------------
//     const renderCameraContent = () => {
//         return (
//             <View style={styles.camera}>
//                 <View style={styles.scannerOverlay}>
//                     {/* Индикатор статуса сервера */}
//                     {renderStatusIndicator()}

//                     <View
//                         ref={frameRef}
//                         style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}
//                     >
//                         <View style={styles.cornerTopLeft} />
//                         <View style={styles.cornerTopRight} />
//                         <View style={styles.cornerBottomLeft} />
//                         <View style={styles.cornerBottomRight} />

//                         {!isTakingPhoto && !capturedPhoto && !showSolutions && (
//                             <>
//                                 <View {...topResizePanResponder.panHandlers} style={styles.resizeHandleTopArea}>
//                                     <View style={styles.resizeHandleVisualHorizontal} />
//                                 </View>
//                                 <View {...bottomResizePanResponder.panHandlers} style={styles.resizeHandleBottomArea}>
//                                     <View style={styles.resizeHandleVisualHorizontal} />
//                                 </View>
//                                 <View {...leftResizePanResponder.panHandlers} style={styles.resizeHandleLeftArea}>
//                                     <View style={styles.resizeHandleVisualVertical} />
//                                 </View>
//                                 <View {...rightResizePanResponder.panHandlers} style={styles.resizeHandleRightArea}>
//                                     <View style={styles.resizeHandleVisualVertical} />
//                                 </View>
//                             </>
//                         )}

//                         <View style={styles.crosshair}>
//                             <View style={styles.crosshairVertical} />
//                             <View style={styles.crosshairHorizontal} />
//                         </View>
//                     </View>

//                     <Text style={styles.scannerText}>Наведите рамку на физическую задачу</Text>
//                     <Text style={styles.scannerSubtext}>Убедитесь, что текст хорошо виден</Text>
//                 </View>

//                 <View style={styles.cameraControls}>
//                     {!capturedPhoto && (
//                         <TouchableOpacity
//                             style={[
//                                 styles.captureButton, 
//                                 (isTakingPhoto || serverStatus === 'offline') && styles.captureButtonDisabled
//                             ]}
//                             onPress={takePicture}
//                             disabled={isTakingPhoto || serverStatus === 'offline'} 
//                         >
//                             <View style={styles.captureButtonInner} />
//                         </TouchableOpacity>
//                     )}
//                 </View>
//             </View>
//         );
//     };

//     if (!permission) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#2E86AB" />
//                 <Text style={styles.loadingText}>Загрузка разрешений...</Text>
//             </View>
//         );
//     }

//     if (!permission.granted) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.permissionText}>Нужен доступ к камере</Text>
//                 <Text style={styles.permissionSubtext}>Для работы приложения необходимо разрешение на использование камеры</Text>
//                 <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//                     <Text style={styles.permissionButtonText}>Разрешить использование камеры</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {capturedPhoto ? (
//                 renderAnimatedResult()
//             ) : (
//                 <CameraView 
//                     ref={cameraRef} 
//                     style={styles.camera} 
//                     facing="back"
//                 >
//                     {renderCameraContent()}
//                 </CameraView>
//             )}

//             {showSolutions && <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />}

//             {showSolutions && (
//                 <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
//                     <View style={styles.closeButtonBackground}>
//                         <Text style={styles.closeButtonText}>×</Text>
//                     </View>
//                 </TouchableOpacity>
//             )}

//             {showSolutions && (
//                 <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }], zIndex: 2000 }]}>
//                     {isScrolledToTop && <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />}

//                     <View style={styles.swipeIndicator}>
//                         <View style={styles.swipeLine} />
//                     </View>

//                     <ScrollView 
//                         style={styles.solutionsScroll} 
//                         contentContainerStyle={styles.scrollContent} 
//                         showsVerticalScrollIndicator={false} 
//                         onScroll={handleScroll} 
//                         scrollEventThrottle={16}
//                     >
//                         {collectedData.methods.length > 0 ? (
//                             collectedData.methods.map((m, i) => (
//                                 <View key={i} style={styles.solutionWidget}>
//                                     <Text style={styles.methodTitle}>{m.title}</Text>

//                                     <View style={styles.formulasContainer}>
//                                         <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                                         {m.formulas.map((f, fi) => (
//                                             <Text key={fi} style={styles.formulaText}>
//                                                 {f}
//                                             </Text>
//                                         ))}
//                                     </View>

//                                     <View style={styles.answerContainer}>
//                                         <Text style={styles.answerLabel}>Ответ:</Text>
//                                         <Text style={styles.answerText}>{m.answer}</Text>
//                                     </View>

//                                     <TouchableOpacity style={styles.stepsButton} onPress={() => handleShowSteps(i)}>
//                                         <Text style={styles.stepsButtonText}>📋 Показать шаги решения</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             ))
//                         ) : (
//                             <View style={styles.solutionWidget}>
//                                 <Text style={styles.methodTitle}>Решение не найдено</Text>
//                                 <Text style={styles.formulasLabel}>
//                                     DeepSeek API не смог обработать задачу. Попробуйте:
//                                 </Text>
//                                 <Text style={styles.formulaText}>
//                                     • Сфотографировать более четко{"\n"}
//                                     • Убедиться, что задача физическая{"\n"}
//                                     • Проверить баланс API ключа
//                                 </Text>
//                                 <TouchableOpacity style={styles.stepsButton} onPress={handleCloseSolutions}>
//                                     <Text style={styles.stepsButtonText}>⟲ Попробовать снова</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         )}
//                     </ScrollView>
//                 </Animated.View>
//             )}
//         </View>
//     );
// }

// // ------------------- СТИЛИ -------------------
// const styles = StyleSheet.create({
//     container: { 
//         flex: 1, 
//         backgroundColor: "black" 
//     },
//     loadingText: {
//         color: "white", 
//         fontSize: 16, 
//         textAlign: "center", 
//         marginTop: 20
//     },

//     // Статус сервера
//     statusContainer: {
//         position: 'absolute',
//         top: Platform.OS === 'ios' ? 60 : 40,
//         left: 20,
//         right: 20,
//         backgroundColor: 'rgba(0,0,0,0.7)',
//         padding: 12,
//         borderRadius: 8,
//         flexDirection: 'row',
//         alignItems: 'center',
//         zIndex: 100
//     },
//     statusDot: {
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         marginRight: 8
//     },
//     statusText: {
//         color: 'white',
//         fontSize: 14,
//         fontWeight: '600'
//     },
//     retryText: {
//         color: 'rgba(255,255,255,0.7)',
//         fontSize: 12,
//         marginLeft: 'auto'
//     },

//     // Разрешения камеры
//     permissionText: { 
//         color: "white", 
//         fontSize: 22, 
//         fontWeight: "bold",
//         textAlign: "center", 
//         marginBottom: 12 
//     },
//     permissionSubtext: {
//         color: "rgba(255,255,255,0.8)", 
//         fontSize: 16, 
//         textAlign: "center", 
//         marginBottom: 30,
//         paddingHorizontal: 20,
//         lineHeight: 22
//     },
//     permissionButton: { 
//         backgroundColor: "#2E86AB", 
//         paddingHorizontal: 30, 
//         paddingVertical: 16, 
//         borderRadius: 12 
//     },
//     permissionButtonText: { 
//         color: "white", 
//         fontSize: 18, 
//         fontWeight: "600" 
//     },

//     camera: { 
//         flex: 1 
//     },

//     scannerOverlay: { 
//         flex: 1, 
//         alignItems: "center", 
//         justifyContent: "center", 
//         paddingBottom: 100 
//     },
//     scannerFrame: {
//         borderWidth: 0,
//         borderColor: "rgba(255,255,255,0.3)",
//         backgroundColor: "transparent",
//         alignItems: "center",
//         justifyContent: "center"
//     },

//     cornerTopLeft: { 
//         position: "absolute", 
//         top: -1, 
//         left: -1, 
//         width: 20, 
//         height: 20, 
//         borderTopWidth: 3, 
//         borderLeftWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerTopRight: { 
//         position: "absolute", 
//         top: -1, 
//         right: -1, 
//         width: 20, 
//         height: 20, 
//         borderTopWidth: 3, 
//         borderRightWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerBottomLeft: { 
//         position: "absolute", 
//         bottom: -1, 
//         left: -1, 
//         width: 20, 
//         height: 20, 
//         borderBottomWidth: 3, 
//         borderLeftWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerBottomRight: { 
//         position: "absolute", 
//         bottom: -1, 
//         right: -1, 
//         width: 20, 
//         height: 20, 
//         borderBottomWidth: 3, 
//         borderRightWidth: 3, 
//         borderColor: "white" 
//     },

//     crosshair: { 
//         position: "absolute", 
//         alignItems: "center", 
//         justifyContent: "center", 
//         opacity: 0.5 
//     },
//     crosshairVertical: { 
//         width: 1, 
//         height: 15, 
//         backgroundColor: "white" 
//     },
//     crosshairHorizontal: { 
//         width: 15, 
//         height: 1, 
//         backgroundColor: "white", 
//         position: "absolute" 
//     },

//     resizeHandleTopArea: { 
//         position: "absolute", 
//         top: -20, 
//         left: 0, 
//         right: 0, 
//         height: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleBottomArea: { 
//         position: "absolute", 
//         bottom: -20, 
//         left: 0, 
//         right: 0, 
//         height: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleLeftArea: { 
//         position: "absolute", 
//         left: -20, 
//         top: 0, 
//         bottom: 0, 
//         width: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleRightArea: { 
//         position: "absolute", 
//         right: -20, 
//         top: 0, 
//         bottom: 0, 
//         width: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },

//     resizeHandleVisualHorizontal: { 
//         width: 40, 
//         height: 4, 
//         backgroundColor: "rgba(255,255,255,0.8)", 
//         borderRadius: 2 
//     },
//     resizeHandleVisualVertical: { 
//         width: 4, 
//         height: 40, 
//         backgroundColor: "rgba(255,255,255,0.8)", 
//         borderRadius: 2 
//     },

//     scannerText: { 
//         color: "white", 
//         fontSize: 18, 
//         fontWeight: "600",
//         marginTop: 30, 
//         textAlign: "center", 
//         textShadowColor: "black", 
//         textShadowRadius: 5 
//     },
//     scannerSubtext: {
//         color: "rgba(255,255,255,0.7)", 
//         fontSize: 14, 
//         marginTop: 8, 
//         textAlign: "center", 
//         textShadowColor: "black", 
//         textShadowRadius: 3
//     },

//     cameraControls: { 
//         position: "absolute", 
//         bottom: 40, 
//         left: 0, 
//         right: 0, 
//         alignItems: "center" 
//     },
//     captureButton: { 
//         width: 70, 
//         height: 70, 
//         borderRadius: 35, 
//         backgroundColor: "rgba(255,255,255,0.3)", 
//         alignItems: "center", 
//         justifyContent: "center" 
//     },
//     captureButtonDisabled: { 
//         opacity: 0.3 
//     },
//     captureButtonInner: { 
//         width: 60, 
//         height: 60, 
//         borderRadius: 30, 
//         backgroundColor: "white" 
//     },

//     processingIndicator: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(0,0,0,0.7)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 100,
//     },
//     processingText: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginTop: 20,
//         textAlign: 'center'
//     },
//     processingSubtext: {
//         color: 'rgba(255,255,255,0.7)',
//         fontSize: 14,
//         marginTop: 8,
//         textAlign: 'center'
//     },
    
//     outsideSwipeArea: { 
//         position: "absolute", 
//         top: 0, 
//         left: 0, 
//         right: 0, 
//         bottom: "40%", 
//         backgroundColor: "transparent", 
//         zIndex: 1999 
//     },
//     closeButton: { 
//         position: "absolute", 
//         top: 50, 
//         right: 20, 
//         zIndex: 2002 
//     },
//     closeButtonBackground: { 
//         width: 40, 
//         height: 40, 
//         borderRadius: 20, 
//         backgroundColor: "rgba(0, 0, 0, 0.5)", 
//         alignItems: "center", 
//         justifyContent: "center" 
//     },
//     closeButtonText: { 
//         color: "white", 
//         fontSize: 24, 
//         fontWeight: "bold", 
//         marginTop: -2 
//     },

//     solutionsContainer: { 
//         position: "absolute", 
//         bottom: 0, 
//         left: 0, 
//         right: 0, 
//         backgroundColor: "white", 
//         borderTopLeftRadius: 20, 
//         borderTopRightRadius: 20, 
//         maxHeight: `${Math.floor(BOTTOM_PANEL_RATIO * 100)}%`, 
//         zIndex: 2000 
//     },
//     overlaySwipeArea: { 
//         position: "absolute", 
//         top: 0, 
//         left: 0, 
//         right: 0, 
//         height: 60, 
//         backgroundColor: "transparent", 
//         zIndex: 2001 
//     },
//     swipeIndicator: { 
//         alignItems: "center", 
//         paddingTop: 8, 
//         paddingBottom: 8, 
//         zIndex: 2001 
//     },
//     swipeLine: { 
//         width: 40, 
//         height: 4, 
//         backgroundColor: "#ccc", 
//         borderRadius: 2 
//     },
//     solutionsScroll: { 
//         flex: 1 
//     },
//     scrollContent: { 
//         padding: 16, 
//         paddingTop: 0 
//     },

//     solutionWidget: { 
//         backgroundColor: "#f8f9fa", 
//         borderRadius: 12, 
//         padding: 20, 
//         marginBottom: 16, 
//         elevation: 3, 
//         shadowColor: "#000", 
//         shadowOffset: { width: 0, height: 2 }, 
//         shadowOpacity: 0.1, 
//         shadowRadius: 4 
//     },
//     methodTitle: { 
//         fontSize: 18, 
//         fontWeight: "bold", 
//         color: "#2c3e50", 
//         marginBottom: 12 
//     },
//     formulasContainer: { 
//         backgroundColor: "white", 
//         padding: 12, 
//         borderRadius: 8, 
//         marginBottom: 12 
//     },
//     formulasLabel: { 
//         fontSize: 14, 
//         fontWeight: "bold", 
//         color: "#2c3e50", 
//         marginBottom: 8 
//     },
//     formulaText: { 
//         fontSize: 14, 
//         color: "#2c3e50", 
//         fontFamily: "monospace", 
//         marginBottom: 6, 
//         lineHeight: 18 
//     },
//     answerContainer: { 
//         backgroundColor: "#E3F2FD", 
//         padding: 12, 
//         borderRadius: 8, 
//         marginBottom: 12, 
//         borderLeftWidth: 4, 
//         borderLeftColor: "#2196F3" 
//     },
//     answerLabel: {
//         fontSize: 14,
//         fontWeight: "bold",
//         color: "#1976D2",
//         marginBottom: 4
//     },
//     answerText: { 
//         fontSize: 16, 
//         fontWeight: "bold", 
//         color: "#1976D2", 
//         textAlign: "left" 
//     },
//     stepsButton: { 
//         backgroundColor: "#2196F3", 
//         paddingVertical: 12, 
//         paddingHorizontal: 20, 
//         borderRadius: 8, 
//         alignItems: "center" 
//     },
//     stepsButtonText: { 
//         color: "white", 
//         fontSize: 14, 
//         fontWeight: "600" 
//     }
// });









// import React, { useRef, useState, useEffect } from "react";
// import {
//     StyleSheet,
//     View,
//     Text,
//     TouchableOpacity,
//     Alert,
//     ScrollView,
//     Animated,
//     PanResponder,
//     Image,
//     Dimensions,
//     Platform,
//     Easing,
//     ActivityIndicator
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// const BOTTOM_PANEL_RATIO = 0.45;
// const TOP_AVAILABLE_RATIO = 1 - BOTTOM_PANEL_RATIO;
// const TOP_MARGIN = Platform.OS === "android" ? 24 : 34;
// const MAX_FRAME_HEIGHT = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN - 8;

// // Адрес твоего локального Python-сервера
// const SERVER_URL = `http://192.168.0.11:5000/solve`;

// // Интерфейсы для структуры данных
// interface SolutionMethod {
//     title: string;
//     answer: string;
//     formulas: string[];
//     steps: string[];
// }

// export default function PhysicsSolver() {
//     const [permission, requestPermission] = useCameraPermissions();
//     const cameraRef = useRef<CameraView>(null);
//     const frameRef = useRef<View>(null); 

//     const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//     const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
//     const [showSolutions, setShowSolutions] = useState(false);
//     const [isScrolledToTop, setIsScrolledToTop] = useState(true);
    
//     // Состояние для хранения данных от сервера
//     const [collectedData, setCollectedData] = useState<{ methods: SolutionMethod[] }>({ methods: [] });
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

//     // Анимация виджетов (снизу вверх)
//     const initialPanelTranslate = Math.floor(SCREEN_HEIGHT * BOTTOM_PANEL_RATIO);
//     const slideAnim = useRef(new Animated.Value(initialPanelTranslate)).current;
    
//     // Анимация рамки (от центра к верху)
//     const moveFrameAnim = useRef(new Animated.Value(0)).current;

//     // Храним координаты для анимации
//     const [sourceRect, setSourceRect] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
//     const [targetRect, setTargetRect] = useState<{ x: number, y: number } | null>(null);

//     const [frameSize, setFrameSize] = useState({
//         width: Math.min(300, SCREEN_WIDTH - 40),
//         height: Math.min(200, MAX_FRAME_HEIGHT)
//     });
//     const initialFrameSize = useRef({ ...frameSize });

//     // Проверка статуса сервера при загрузке
//     useEffect(() => {
//         checkServerStatus();
//     }, []);

//     const checkServerStatus = async () => {
//         try {
//             const response = await fetch(SERVER_URL.replace('/solve', '/status'), {
//                 method: 'GET',
//                 timeout: 5000
//             });
//             const result = await response.json();
            
//             if (result.success && result.api_key_valid) {
//                 setServerStatus('online');
//                 console.log('✅ Сервер работает, API ключ действителен');
//             } else {
//                 setServerStatus('offline');
//                 console.log('❌ Сервер недоступен или API ключ недействителен');
//             }
//         } catch (error) {
//             setServerStatus('offline');
//             console.log('❌ Не удалось подключиться к серверу');
//         }
//     };

//     // ------------------- ЖЕСТЫ И РЕСАЙЗ -------------------
//     const swipePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx),
//             onPanResponderMove: (_, g) => {
//                 if (g.dy > 0) slideAnim.setValue(g.dy);
//             },
//             onPanResponderRelease: (_, g) => {
//                 if (g.dy > 80) {
//                     handleCloseWithAlert();
//                 } else {
//                     Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
//                 }
//             }
//         })
//     ).current;

//     const MIN_SIZE = 100;
//     const MAX_WIDTH = SCREEN_WIDTH - 40;
//     const MAX_HEIGHT = MAX_FRAME_HEIGHT;

//     const handleResizeStart = () => {
//         initialFrameSize.current = { ...frameSize };
//     };

//     const topResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newHeight = Math.min(
//                     MAX_HEIGHT,
//                     Math.max(MIN_SIZE, initialFrameSize.current.height - g.dy * 2)
//                 );
//                 setFrameSize((p) => ({ ...p, height: newHeight }));
//             }
//         })
//     ).current;

//     const bottomResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newHeight = Math.min(
//                     MAX_HEIGHT,
//                     Math.max(MIN_SIZE, initialFrameSize.current.height + g.dy * 2)
//                 );
//                 setFrameSize((p) => ({ ...p, height: newHeight }));
//             }
//         })
//     ).current;

//     const leftResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - g.dx * 2));
//                 setFrameSize((p) => ({ ...p, width: newWidth }));
//             }
//         })
//     ).current;

//     const rightResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + g.dx * 2));
//                 setFrameSize((p) => ({ ...p, width: newWidth }));
//             }
//         })
//     ).current;

//     // ------------------- ЛОГИКА ФОТОГРАФИРОВАНИЯ -------------------
//     const takePicture = async () => {
//         if (!cameraRef.current || !frameRef.current) return;
        
//         // Проверяем статус сервера перед съемкой
//         if (serverStatus === 'offline') {
//             Alert.alert(
//                 "Сервер недоступен", 
//                 "Проверьте:\n1. Запущен ли server.py на компьютере\n2. Корректный ли API ключ в server.py\n3. Правильный ли IP-адрес в настройках",
//                 [{ text: "Понятно" }]
//             );
//             return;
//         }

//         setIsTakingPhoto(true);
//         setIsProcessing(true); 

//         try {
//             let currentSourceRect = null as { x: number, y: number, width: number, height: number } | null;

//             // Получаем координаты рамки
//             await new Promise<void>((resolve, reject) => {
//                 if (!frameRef.current) {
//                     reject(new Error("Frame ref not available"));
//                     return;
//                 }

//                 // @ts-ignore
//                 frameRef.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
//                     currentSourceRect = { x: px, y: py, width, height };
//                     setSourceRect(currentSourceRect);

//                     const availableHeight = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN;
//                     const targetY = TOP_MARGIN + (availableHeight - height) / 2;
//                     const targetX = (SCREEN_WIDTH - width) / 2;
                    
//                     setTargetRect({ x: targetX, y: targetY });
//                     resolve();
//                 });
//             });

//             if (!currentSourceRect) {
//                 throw new Error("Не удалось измерить позицию рамки.");
//             }

//             // Делаем фото
//             console.log("📸 Делаем фото...");
//             const photo = await cameraRef.current.takePictureAsync({ 
//                 skipProcessing: false,
//                 base64: true,
//                 quality: 0.8,
//                 exif: true, // <--- ИЗМЕНЕНО: Включен EXIF для корректной ориентации на сервере
//                 mute: true,
//             });
            
//             if (!photo || !photo.base64) {
//                 throw new Error("Камера не вернула фото в base64");
//             }

//             setCapturedPhoto(photo.uri);
//             console.log("✅ Фото сделано, отправляем на сервер...");

//             // ОТПРАВЛЯЕМ КООРДИНАТЫ РАМКИ ДЛЯ ОБРЕЗКИ
//             const requestData = {
//                 image: photo.base64,
//                 frame_rect: {
//                     x: currentSourceRect.x,
//                     y: currentSourceRect.y, 
//                     width: currentSourceRect.width,
//                     height: currentSourceRect.height
//                 },
//                 screen_width: SCREEN_WIDTH,
//                 screen_height: SCREEN_HEIGHT
//             };

//             // Отправляем на сервер с таймаутом
//             const controller = new AbortController();
//             const timeoutId = setTimeout(() => controller.abort(), 120000);

//             const response = await fetch(SERVER_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(requestData),
//                 signal: controller.signal
//             });

//             clearTimeout(timeoutId);

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const result = await response.json();
//             console.log("📡 Ответ от сервера:", result);

//             // Обрабатываем ответ
//             if (result && result.success && Array.isArray(result.solutions)) {
//                 setCollectedData({ methods: result.solutions });
//                 console.log(`✅ Получено ${result.solutions.length} решений от DeepSeek API`);
//             } else {
//                 throw new Error(result.message || "Сервер не вернул решения");
//             }

//             // Запускаем анимации успеха
//             setTimeout(() => {
//                 setIsTakingPhoto(false);
//                 setIsProcessing(false); 
//                 setShowSolutions(true);
                
//                 Animated.parallel([
//                     Animated.timing(slideAnim, { 
//                         toValue: 0, 
//                         duration: 420, 
//                         useNativeDriver: true,
//                         easing: Easing.out(Easing.cubic) 
//                     }),
//                     Animated.timing(moveFrameAnim, {
//                         toValue: 1,
//                         duration: 420,
//                         useNativeDriver: true,
//                         easing: Easing.out(Easing.cubic) 
//                     })
//                 ]).start();
//             }, 100);

//         } catch (err: any) {
//             console.error("❌ Ошибка:", err);
            
//             let errorMessage = "Неизвестная ошибка";
//             if (err.name === 'AbortError') {
//                 errorMessage = "Таймаут запроса (2 минуты). Проверьте сервер.";
//             } else if (err.message) {
//                 errorMessage = err.message;
//             }

//             Alert.alert(
//                 "Ошибка", 
//                 `${errorMessage}\n\nПроверьте:\n• Запущен ли server.py\n• Корректный ли API ключ\n• Стабильно ли интернет-соединение`
//             );
            
//             setIsTakingPhoto(false);
//             setIsProcessing(false);
//             setCapturedPhoto(null);
//             setSourceRect(null); 
//             setTargetRect(null);
//         }
//     };

//     const handleCloseSolutions = () => {
//         Animated.parallel([
//             Animated.timing(slideAnim, { toValue: initialPanelTranslate, duration: 250, useNativeDriver: true }),
//             Animated.timing(moveFrameAnim, { toValue: 0, duration: 250, useNativeDriver: true })
//         ]).start(() => {
//             setShowSolutions(false);
//             setCapturedPhoto(null);
//             setSourceRect(null);
//             setTargetRect(null);
//             setCollectedData({ methods: [] });
//         });
//     };

//     const handleCloseWithAlert = () => {
//         Alert.alert("Вернуться?", "Хотите вернуться к камере?", [
//             {
//                 text: "Отмена",
//                 style: "cancel",
//                 onPress: () => Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start()
//             },
//             { text: "Да", onPress: handleCloseSolutions }
//         ]);
//     };

//     const handleShowSteps = (index: number) => {
//         if (collectedData.methods[index] && collectedData.methods[index].steps) {
//             Alert.alert(
//                 collectedData.methods[index].title, 
//                 collectedData.methods[index].steps.join("\n\n"),
//                 [{ text: "Закрыть", style: "cancel" }]
//             );
//         }
//     };

//     const handleScroll = (e: any) => {
//         setIsScrolledToTop(e.nativeEvent.contentOffset.y <= 10);
//     };

//     const retryServerConnection = () => {
//         setServerStatus('checking');
//         checkServerStatus();
//     };

//     // ------------------- РЕНДЕР ИНДИКАТОРА СТАТУСА -------------------
//     const renderStatusIndicator = () => {
//         if (serverStatus === 'checking') {
//             return (
//                 <View style={styles.statusContainer}>
//                     <ActivityIndicator size="small" color="#666" />
//                     <Text style={styles.statusText}>Проверка сервера...</Text>
//                 </View>
//             );
//         }

//         if (serverStatus === 'offline') {
//             return (
//                 <TouchableOpacity style={styles.statusContainer} onPress={retryServerConnection}>
//                     <View style={[styles.statusDot, { backgroundColor: '#ff4444' }]} />
//                     <Text style={[styles.statusText, { color: '#ff4444' }]}>Сервер недоступен</Text>
//                     <Text style={styles.retryText}>Нажмите для повторной проверки</Text>
//                 </TouchableOpacity>
//             );
//         }

//         return (
//             <View style={styles.statusContainer}>
//                 <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
//                 <Text style={[styles.statusText, { color: '#4CAF50' }]}>✅ Сервер + API доступны</Text>
//             </View>
//         );
//     };

//     // ------------------- РЕНДЕР РЕЗУЛЬТАТА -------------------
//     const renderAnimatedResult = () => {
//         if (!capturedPhoto || !sourceRect || !targetRect) return null;

//         const translateY = moveFrameAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [sourceRect.y, targetRect.y]
//         });

//         const translateX = moveFrameAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [sourceRect.x, targetRect.x]
//         });

//         return (
//             <View style={[StyleSheet.absoluteFill, { backgroundColor: "#222" }]}> 
//                 <Animated.View
//                     style={{
//                         position: "absolute",
//                         width: sourceRect.width,
//                         height: sourceRect.height,
//                         transform: [{ translateX }, { translateY }],
//                         overflow: "hidden", 
//                         borderRadius: 4, 
//                         borderWidth: 0, 
//                         zIndex: 10
//                     }}
//                 >
//                     <Image
//                         source={{ uri: capturedPhoto }}
//                         style={{
//                             position: "absolute",
//                             width: SCREEN_WIDTH,
//                             height: SCREEN_HEIGHT,
//                             top: -sourceRect.y,
//                             left: -sourceRect.x,
//                         }}
//                         resizeMode="cover"
//                     />
                    
//                     <View style={[StyleSheet.absoluteFill, { borderWidth: 2, borderColor: 'white', borderRadius: 4 }]} />
//                 </Animated.View>
                
//                 {isProcessing && (
//                     <View style={styles.processingIndicator}>
//                         <ActivityIndicator size="large" color="#ffffff" />
//                         <Text style={styles.processingText}>Отправляем задачу в DeepSeek API...</Text>
//                         <Text style={styles.processingSubtext}>Обработка через нейросеть</Text>
//                     </View>
//                 )}
//             </View>
//         );
//     };

//     // ------------------- РЕНДЕР КАМЕРЫ -------------------
//     const renderCameraContent = () => {
//         return (
//             <View style={styles.camera}>
//                 <View style={styles.scannerOverlay}>
//                     {/* Индикатор статуса сервера */}
//                     {renderStatusIndicator()}

//                     <View
//                         ref={frameRef}
//                         style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}
//                     >
//                         <View style={styles.cornerTopLeft} />
//                         <View style={styles.cornerTopRight} />
//                         <View style={styles.cornerBottomLeft} />
//                         <View style={styles.cornerBottomRight} />

//                         {!isTakingPhoto && !capturedPhoto && !showSolutions && (
//                             <>
//                                 <View {...topResizePanResponder.panHandlers} style={styles.resizeHandleTopArea}>
//                                     <View style={styles.resizeHandleVisualHorizontal} />
//                                 </View>
//                                 <View {...bottomResizePanResponder.panHandlers} style={styles.resizeHandleBottomArea}>
//                                     <View style={styles.resizeHandleVisualHorizontal} />
//                                 </View>
//                                 <View {...leftResizePanResponder.panHandlers} style={styles.resizeHandleLeftArea}>
//                                     <View style={styles.resizeHandleVisualVertical} />
//                                 </View>
//                                 <View {...rightResizePanResponder.panHandlers} style={styles.resizeHandleRightArea}>
//                                     <View style={styles.resizeHandleVisualVertical} />
//                                 </View>
//                             </>
//                         )}

//                         <View style={styles.crosshair}>
//                             <View style={styles.crosshairVertical} />
//                             <View style={styles.crosshairHorizontal} />
//                         </View>
//                     </View>

//                     <Text style={styles.scannerText}>Наведите рамку на физическую задачу</Text>
//                     <Text style={styles.scannerSubtext}>Убедитесь, что текст хорошо виден</Text>
//                 </View>

//                 <View style={styles.cameraControls}>
//                     {!capturedPhoto && (
//                         <TouchableOpacity
//                             style={[
//                                 styles.captureButton, 
//                                 (isTakingPhoto || serverStatus === 'offline') && styles.captureButtonDisabled
//                             ]}
//                             onPress={takePicture}
//                             disabled={isTakingPhoto || serverStatus === 'offline'} 
//                         >
//                             <View style={styles.captureButtonInner} />
//                         </TouchableOpacity>
//                     )}
//                 </View>
//             </View>
//         );
//     };

//     if (!permission) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#2E86AB" />
//                 <Text style={styles.loadingText}>Загрузка разрешений...</Text>
//             </View>
//         );
//     }

//     if (!permission.granted) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.permissionText}>Нужен доступ к камере</Text>
//                 <Text style={styles.permissionSubtext}>Для работы приложения необходимо разрешение на использование камеры</Text>
//                 <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//                     <Text style={styles.permissionButtonText}>Разрешить использование камеры</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {capturedPhoto ? (
//                 renderAnimatedResult()
//             ) : (
//                 <CameraView 
//                     ref={cameraRef} 
//                     style={styles.camera} 
//                     facing="back"
//                 >
//                     {renderCameraContent()}
//                 </CameraView>
//             )}

//             {showSolutions && <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />}

//             {showSolutions && (
//                 <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
//                     <View style={styles.closeButtonBackground}>
//                         <Text style={styles.closeButtonText}>×</Text>
//                     </View>
//                 </TouchableOpacity>
//             )}

//             {showSolutions && (
//                 <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }], zIndex: 2000 }]}>
//                     {isScrolledToTop && <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />}

//                     <View style={styles.swipeIndicator}>
//                         <View style={styles.swipeLine} />
//                     </View>

//                     <ScrollView 
//                         style={styles.solutionsScroll} 
//                         contentContainerStyle={styles.scrollContent} 
//                         showsVerticalScrollIndicator={false} 
//                         onScroll={handleScroll} 
//                         scrollEventThrottle={16}
//                     >
//                         {collectedData.methods.length > 0 ? (
//                             collectedData.methods.map((m, i) => (
//                                 <View key={i} style={styles.solutionWidget}>
//                                     <Text style={styles.methodTitle}>{m.title}</Text>

//                                     <View style={styles.formulasContainer}>
//                                         <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                                         {m.formulas.map((f, fi) => (
//                                             <Text key={fi} style={styles.formulaText}>
//                                                 {f}
//                                             </Text>
//                                         ))}
//                                     </View>

//                                     <View style={styles.answerContainer}>
//                                         <Text style={styles.answerLabel}>Ответ:</Text>
//                                         <Text style={styles.answerText}>{m.answer}</Text>
//                                     </View>

//                                     <TouchableOpacity style={styles.stepsButton} onPress={() => handleShowSteps(i)}>
//                                         <Text style={styles.stepsButtonText}>📋 Показать шаги решения</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             ))
//                         ) : (
//                             <View style={styles.solutionWidget}>
//                                 <Text style={styles.methodTitle}>Решение не найдено</Text>
//                                 <Text style={styles.formulasLabel}>
//                                     DeepSeek API не смог обработать задачу. Попробуйте:
//                                 </Text>
//                                 <Text style={styles.formulaText}>
//                                     • Сфотографировать более четко{"\n"}
//                                     • Убедиться, что задача физическая{"\n"}
//                                     • Проверить баланс API ключа
//                                 </Text>
//                                 <TouchableOpacity style={styles.stepsButton} onPress={handleCloseSolutions}>
//                                     <Text style={styles.stepsButtonText}>⟲ Попробовать снова</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         )}
//                     </ScrollView>
//                 </Animated.View>
//             )}
//         </View>
//     );
// }

// // ------------------- СТИЛИ -------------------
// const styles = StyleSheet.create({
//     container: { 
//         flex: 1, 
//         backgroundColor: "black" 
//     },
//     loadingText: {
//         color: "white", 
//         fontSize: 16, 
//         textAlign: "center", 
//         marginTop: 20
//     },

//     // Статус сервера
//     statusContainer: {
//         position: 'absolute',
//         top: Platform.OS === 'ios' ? 60 : 40,
//         left: 20,
//         right: 20,
//         backgroundColor: 'rgba(0,0,0,0.7)',
//         padding: 12,
//         borderRadius: 8,
//         flexDirection: 'row',
//         alignItems: 'center',
//         zIndex: 100
//     },
//     statusDot: {
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         marginRight: 8
//     },
//     statusText: {
//         color: 'white',
//         fontSize: 14,
//         fontWeight: '600'
//     },
//     retryText: {
//         color: 'rgba(255,255,255,0.7)',
//         fontSize: 12,
//         marginLeft: 'auto'
//     },

//     // Разрешения камеры
//     permissionText: { 
//         color: "white", 
//         fontSize: 22, 
//         fontWeight: "bold",
//         textAlign: "center", 
//         marginBottom: 12 
//     },
//     permissionSubtext: {
//         color: "rgba(255,255,255,0.8)", 
//         fontSize: 16, 
//         textAlign: "center", 
//         marginBottom: 30,
//         paddingHorizontal: 20,
//         lineHeight: 22
//     },
//     permissionButton: { 
//         backgroundColor: "#2E86AB", 
//         paddingHorizontal: 30, 
//         paddingVertical: 16, 
//         borderRadius: 12 
//     },
//     permissionButtonText: { 
//         color: "white", 
//         fontSize: 18, 
//         fontWeight: "600" 
//     },

//     camera: { 
//         flex: 1 
//     },

//     scannerOverlay: { 
//         flex: 1, 
//         alignItems: "center", 
//         justifyContent: "center", 
//         paddingBottom: 100 
//     },
//     scannerFrame: {
//         borderWidth: 0,
//         borderColor: "rgba(255,255,255,0.3)",
//         backgroundColor: "transparent",
//         alignItems: "center",
//         justifyContent: "center"
//     },

//     cornerTopLeft: { 
//         position: "absolute", 
//         top: -1, 
//         left: -1, 
//         width: 20, 
//         height: 20, 
//         borderTopWidth: 3, 
//         borderLeftWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerTopRight: { 
//         position: "absolute", 
//         top: -1, 
//         right: -1, 
//         width: 20, 
//         height: 20, 
//         borderTopWidth: 3, 
//         borderRightWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerBottomLeft: { 
//         position: "absolute", 
//         bottom: -1, 
//         left: -1, 
//         width: 20, 
//         height: 20, 
//         borderBottomWidth: 3, 
//         borderLeftWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerBottomRight: { 
//         position: "absolute", 
//         bottom: -1, 
//         right: -1, 
//         width: 20, 
//         height: 20, 
//         borderBottomWidth: 3, 
//         borderRightWidth: 3, 
//         borderColor: "white" 
//     },

//     crosshair: { 
//         position: "absolute", 
//         alignItems: "center", 
//         justifyContent: "center", 
//         opacity: 0.5 
//     },
//     crosshairVertical: { 
//         width: 1, 
//         height: 15, 
//         backgroundColor: "white" 
//     },
//     crosshairHorizontal: { 
//         width: 15, 
//         height: 1, 
//         backgroundColor: "white", 
//         position: "absolute" 
//     },

//     resizeHandleTopArea: { 
//         position: "absolute", 
//         top: -20, 
//         left: 0, 
//         right: 0, 
//         height: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleBottomArea: { 
//         position: "absolute", 
//         bottom: -20, 
//         left: 0, 
//         right: 0, 
//         height: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleLeftArea: { 
//         position: "absolute", 
//         left: -20, 
//         top: 0, 
//         bottom: 0, 
//         width: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleRightArea: { 
//         position: "absolute", 
//         right: -20, 
//         top: 0, 
//         bottom: 0, 
//         width: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },

//     resizeHandleVisualHorizontal: { 
//         width: 40, 
//         height: 4, 
//         backgroundColor: "rgba(255,255,255,0.8)", 
//         borderRadius: 2 
//     },
//     resizeHandleVisualVertical: { 
//         width: 4, 
//         height: 40, 
//         backgroundColor: "rgba(255,255,255,0.8)", 
//         borderRadius: 2 
//     },

//     scannerText: { 
//         color: "white", 
//         fontSize: 18, 
//         fontWeight: "600",
//         marginTop: 30, 
//         textAlign: "center", 
//         textShadowColor: "black", 
//         textShadowRadius: 5 
//     },
//     scannerSubtext: {
//         color: "rgba(255,255,255,0.7)", 
//         fontSize: 14, 
//         marginTop: 8, 
//         textAlign: "center", 
//         textShadowColor: "black", 
//         textShadowRadius: 3
//     },

//     cameraControls: { 
//         position: "absolute", 
//         bottom: 40, 
//         left: 0, 
//         right: 0, 
//         alignItems: "center" 
//     },
//     captureButton: { 
//         width: 70, 
//         height: 70, 
//         borderRadius: 35, 
//         backgroundColor: "rgba(255,255,255,0.3)", 
//         alignItems: "center", 
//         justifyContent: "center" 
//     },
//     captureButtonDisabled: { 
//         opacity: 0.3 
//     },
//     captureButtonInner: { 
//         width: 60, 
//         height: 60, 
//         borderRadius: 30, 
//         backgroundColor: "white" 
//     },

//     processingIndicator: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(0,0,0,0.7)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 100,
//     },
//     processingText: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginTop: 20,
//         textAlign: 'center'
//     },
//     processingSubtext: {
//         color: 'rgba(255,255,255,0.7)',
//         fontSize: 14,
//         marginTop: 8,
//         textAlign: 'center'
//     },
    
//     outsideSwipeArea: { 
//         position: "absolute", 
//         top: 0, 
//         left: 0, 
//         right: 0, 
//         bottom: "40%", 
//         backgroundColor: "transparent", 
//         zIndex: 1999 
//     },
//     closeButton: { 
//         position: "absolute", 
//         top: 50, 
//         right: 20, 
//         zIndex: 2002 
//     },
//     closeButtonBackground: { 
//         width: 40, 
//         height: 40, 
//         borderRadius: 20, 
//         backgroundColor: "rgba(0, 0, 0, 0.5)", 
//         alignItems: "center", 
//         justifyContent: "center" 
//     },
//     closeButtonText: { 
//         color: "white", 
//         fontSize: 24, 
//         fontWeight: "bold", 
//         marginTop: -2 
//     },

//     solutionsContainer: { 
//         position: "absolute", 
//         bottom: 0, 
//         left: 0, 
//         right: 0, 
//         backgroundColor: "white", 
//         borderTopLeftRadius: 20, 
//         borderTopRightRadius: 20, 
//         maxHeight: `${Math.floor(BOTTOM_PANEL_RATIO * 100)}%`, 
//         zIndex: 2000 
//     },
//     overlaySwipeArea: { 
//         position: "absolute", 
//         top: 0, 
//         left: 0, 
//         right: 0, 
//         height: 60, 
//         backgroundColor: "transparent", 
//         zIndex: 2001 
//     },
//     swipeIndicator: { 
//         alignItems: "center", 
//         paddingTop: 8, 
//         paddingBottom: 8, 
//         zIndex: 2001 
//     },
//     swipeLine: { 
//         width: 40, 
//         height: 4, 
//         backgroundColor: "#ccc", 
//         borderRadius: 2 
//     },
//     solutionsScroll: { 
//         flex: 1 
//     },
//     scrollContent: { 
//         padding: 16, 
//         paddingTop: 0 
//     },

//     solutionWidget: { 
//         backgroundColor: "#f8f9fa", 
//         borderRadius: 12, 
//         padding: 20, 
//         marginBottom: 16, 
//         elevation: 3, 
//         shadowColor: "#000", 
//         shadowOffset: { width: 0, height: 2 }, 
//         shadowOpacity: 0.1, 
//         shadowRadius: 4 
//     },
//     methodTitle: { 
//         fontSize: 18, 
//         fontWeight: "bold", 
//         color: "#2c3e50", 
//         marginBottom: 12 
//     },
//     formulasContainer: { 
//         backgroundColor: "white", 
//         padding: 12, 
//         borderRadius: 8, 
//         marginBottom: 12 
//     },
//     formulasLabel: { 
//         fontSize: 14, 
//         fontWeight: "bold", 
//         color: "#2c3e50", 
//         marginBottom: 8 
//     },
//     formulaText: { 
//         fontSize: 14, 
//         color: "#2c3e50", 
//         fontFamily: "monospace", 
//         marginBottom: 6, 
//         lineHeight: 18 
//     },
//     answerContainer: { 
//         backgroundColor: "#E3F2FD", 
//         padding: 12, 
//         borderRadius: 8, 
//         marginBottom: 12, 
//         borderLeftWidth: 4, 
//         borderLeftColor: "#2196F3" 
//     },
//     answerLabel: {
//         fontSize: 14,
//         fontWeight: "bold",
//         color: "#1976D2",
//         marginBottom: 4
//     },
//     answerText: { 
//         fontSize: 16, 
//         fontWeight: "bold", 
//         color: "#1976D2", 
//         textAlign: "left" 
//     },
//     stepsButton: { 
//         backgroundColor: "#2196F3", 
//         paddingVertical: 12, 
//         paddingHorizontal: 20, 
//         borderRadius: 8, 
//         alignItems: "center" 
//     },
//     stepsButtonText: { 
//         color: "white", 
//         fontSize: 14, 
//         fontWeight: "600" 
//     }
// });
























// 111111111111111111111111111111111chat111111111111111111111111111111111chat111111111111111111111111111111111chat111111111111111111111111111111111chat111111111111111111111111111111111chat
// import React, { useRef, useState, useEffect } from "react";
// import {
//     StyleSheet,
//     View,
//     Text,
//     TouchableOpacity,
//     Alert,
//     ScrollView,
//     Animated,
//     PanResponder,
//     Image,
//     Dimensions,
//     Platform,
//     Easing,
//     ActivityIndicator
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// const BOTTOM_PANEL_RATIO = 0.45;
// const TOP_AVAILABLE_RATIO = 1 - BOTTOM_PANEL_RATIO;
// const TOP_MARGIN = Platform.OS === "android" ? 24 : 34;
// const MAX_FRAME_HEIGHT = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN - 8;

// // Адрес твоего локального Python-сервера
// const SERVER_URL = `http://192.168.0.11:5000/solve`;

// // Интерфейсы для структуры данных
// interface SolutionMethod {
//     title: string;
//     answer: string;
//     formulas: string[];
//     steps: string[];
// }

// export default function PhysicsSolver() {
//     const [permission, requestPermission] = useCameraPermissions();
//     const cameraRef = useRef<CameraView>(null);
//     const frameRef = useRef<View>(null); 

//     const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//     const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
//     const [showSolutions, setShowSolutions] = useState(false);
//     const [isScrolledToTop, setIsScrolledToTop] = useState(true);
    
//     // Состояние для хранения данных от сервера
//     const [collectedData, setCollectedData] = useState<{ methods: SolutionMethod[] }>({ methods: [] });
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

//     // Анимация виджетов (снизу вверх)
//     const initialPanelTranslate = Math.floor(SCREEN_HEIGHT * BOTTOM_PANEL_RATIO);
//     const slideAnim = useRef(new Animated.Value(initialPanelTranslate)).current;
    
//     // Анимация рамки (от центра к верху)
//     const moveFrameAnim = useRef(new Animated.Value(0)).current;

//     // Храним координаты для анимации
//     const [sourceRect, setSourceRect] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
//     const [targetRect, setTargetRect] = useState<{ x: number, y: number } | null>(null);

//     const [frameSize, setFrameSize] = useState({
//         width: Math.min(300, SCREEN_WIDTH - 40),
//         height: Math.min(200, MAX_FRAME_HEIGHT)
//     });
//     const initialFrameSize = useRef({ ...frameSize });

//     // Проверка статуса сервера при загрузке
//     useEffect(() => {
//         checkServerStatus();
//     }, []);

//     const checkServerStatus = async () => {
//         try {
//             const response = await fetch(SERVER_URL.replace('/solve', '/status'), {
//                 method: 'GET',
//                 timeout: 5000
//             });
//             const result = await response.json();
            
//             if (result.success && result.api_key_valid) {
//                 setServerStatus('online');
//                 console.log('✅ Сервер работает, API ключ действителен');
//             } else {
//                 setServerStatus('offline');
//                 console.log('❌ Сервер недоступен или API ключ недействителен');
//             }
//         } catch (error) {
//             setServerStatus('offline');
//             console.log('❌ Не удалось подключиться к серверу');
//         }
//     };

//     // ------------------- ЖЕСТЫ И РЕСАЙЗ -------------------
//     const swipePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx),
//             onPanResponderMove: (_, g) => {
//                 if (g.dy > 0) slideAnim.setValue(g.dy);
//             },
//             onPanResponderRelease: (_, g) => {
//                 if (g.dy > 80) {
//                     handleCloseWithAlert();
//                 } else {
//                     Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
//                 }
//             }
//         })
//     ).current;

//     const MIN_SIZE = 100;
//     const MAX_WIDTH = SCREEN_WIDTH - 40;
//     const MAX_HEIGHT = MAX_FRAME_HEIGHT;

//     const handleResizeStart = () => {
//         initialFrameSize.current = { ...frameSize };
//     };

//     const topResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newHeight = Math.min(
//                     MAX_HEIGHT,
//                     Math.max(MIN_SIZE, initialFrameSize.current.height - g.dy * 2)
//                 );
//                 setFrameSize((p) => ({ ...p, height: newHeight }));
//             }
//         })
//     ).current;

//     const bottomResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newHeight = Math.min(
//                     MAX_HEIGHT,
//                     Math.max(MIN_SIZE, initialFrameSize.current.height + g.dy * 2)
//                 );
//                 setFrameSize((p) => ({ ...p, height: newHeight }));
//             }
//         })
//     ).current;

//     const leftResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - g.dx * 2));
//                 setFrameSize((p) => ({ ...p, width: newWidth }));
//             }
//         })
//     ).current;

//     const rightResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + g.dx * 2));
//                 setFrameSize((p) => ({ ...p, width: newWidth }));
//             }
//         })
//     ).current;

//     // ------------------- ЛОГИКА ФОТОГРАФИРОВАНИЯ -------------------
//     const takePicture = async () => {
//         if (!cameraRef.current || !frameRef.current) return;
        
//         // Проверяем статус сервера перед съемкой
//         if (serverStatus === 'offline') {
//             Alert.alert(
//                 "Сервер недоступен", 
//                 "Проверьте:\n1. Запущен ли server.py на компьютере\n2. Корректный ли API ключ в server.py\n3. Правильный ли IP-адрес в настройках",
//                 [{ text: "Понятно" }]
//             );
//             return;
//         }

//         setIsTakingPhoto(true);
//         setIsProcessing(true); 

//         try {
//             let currentSourceRect = null as { x: number, y: number, width: number, height: number } | null;

//             // Получаем координаты рамки
//             await new Promise<void>((resolve, reject) => {
//                 if (!frameRef.current) {
//                     reject(new Error("Frame ref not available"));
//                     return;
//                 }

//                 // @ts-ignore
//                 frameRef.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
//                     currentSourceRect = { x: px, y: py, width, height };
//                     setSourceRect(currentSourceRect);

//                     const availableHeight = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN;
//                     const targetY = TOP_MARGIN + (availableHeight - height) / 2;
//                     const targetX = (SCREEN_WIDTH - width) / 2;
                    
//                     setTargetRect({ x: targetX, y: targetY });
//                     resolve();
//                 });
//             });

//             if (!currentSourceRect) {
//                 throw new Error("Не удалось измерить позицию рамки.");
//             }

//             // Делаем фото
//             console.log("📸 Делаем фото...");
//             const photo = await cameraRef.current.takePictureAsync({ 
//                 skipProcessing: false,
//                 base64: true,
//                 quality: 0.8,
//                 exif: true, // <--- ИЗМЕНЕНО: Включен EXIF для корректной ориентации на сервере
                
//             });
            
//             if (!photo || !photo.base64) {
//                 throw new Error("Камера не вернула фото в base64");
//             }

//             setCapturedPhoto(photo.uri);
//             console.log("✅ Фото сделано, отправляем на сервер...");

//             // ОТПРАВЛЯЕМ КООРДИНАТЫ РАМКИ ДЛЯ ОБРЕЗКИ
//             const requestData = {
//                 image: photo.base64,
//                 frame_rect: {
//                     x: currentSourceRect.x,
//                     y: currentSourceRect.y, 
//                     width: currentSourceRect.width,
//                     height: currentSourceRect.height
//                 },
//                 screen_width: SCREEN_WIDTH,
//                 screen_height: SCREEN_HEIGHT
//             };

//             // Отправляем на сервер с таймаутом
//             const controller = new AbortController();
//             const timeoutId = setTimeout(() => controller.abort(), 120000);

//             const response = await fetch(SERVER_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(requestData),
//                 signal: controller.signal
//             });

//             clearTimeout(timeoutId);

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const result = await response.json();
//             console.log("📡 Ответ от сервера:", result);

//             // Обрабатываем ответ
//             if (result && result.success && Array.isArray(result.solutions)) {
//                 setCollectedData({ methods: result.solutions });
//                 console.log(`✅ Получено ${result.solutions.length} решений от DeepSeek API`);
//             } else {
//                 throw new Error(result.message || "Сервер не вернул решения");
//             }

//             // Запускаем анимации успеха
//             setTimeout(() => {
//                 setIsTakingPhoto(false);
//                 setIsProcessing(false); 
//                 setShowSolutions(true);
                
//                 Animated.parallel([
//                     Animated.timing(slideAnim, { 
//                         toValue: 0, 
//                         duration: 420, 
//                         useNativeDriver: true,
//                         easing: Easing.out(Easing.cubic) 
//                     }),
//                     Animated.timing(moveFrameAnim, {
//                         toValue: 1,
//                         duration: 420,
//                         useNativeDriver: true,
//                         easing: Easing.out(Easing.cubic) 
//                     })
//                 ]).start();
//             }, 100);

//         } catch (err: any) {
//             console.error("❌ Ошибка:", err);
            
//             let errorMessage = "Неизвестная ошибка";
//             if (err.name === 'AbortError') {
//                 errorMessage = "Таймаут запроса (2 минуты). Проверьте сервер.";
//             } else if (err.message) {
//                 errorMessage = err.message;
//             }

//             Alert.alert(
//                 "Ошибка", 
//                 `${errorMessage}\n\nПроверьте:\n• Запущен ли server.py\n• Корректный ли API ключ\n• Стабильно ли интернет-соединение`
//             );
            
//             setIsTakingPhoto(false);
//             setIsProcessing(false);
//             setCapturedPhoto(null);
//             setSourceRect(null); 
//             setTargetRect(null);
//         }
//     };

//     const handleCloseSolutions = () => {
//         Animated.parallel([
//             Animated.timing(slideAnim, { toValue: initialPanelTranslate, duration: 250, useNativeDriver: true }),
//             Animated.timing(moveFrameAnim, { toValue: 0, duration: 250, useNativeDriver: true })
//         ]).start(() => {
//             setShowSolutions(false);
//             setCapturedPhoto(null);
//             setSourceRect(null);
//             setTargetRect(null);
//             setCollectedData({ methods: [] });
//         });
//     };

//     const handleCloseWithAlert = () => {
//         Alert.alert("Вернуться?", "Хотите вернуться к камере?", [
//             {
//                 text: "Отмена",
//                 style: "cancel",
//                 onPress: () => Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start()
//             },
//             { text: "Да", onPress: handleCloseSolutions }
//         ]);
//     };

//     const handleShowSteps = (index: number) => {
//         if (collectedData.methods[index] && collectedData.methods[index].steps) {
//             Alert.alert(
//                 collectedData.methods[index].title, 
//                 collectedData.methods[index].steps.join("\n\n"),
//                 [{ text: "Закрыть", style: "cancel" }]
//             );
//         }
//     };

//     const handleScroll = (e: any) => {
//         setIsScrolledToTop(e.nativeEvent.contentOffset.y <= 10);
//     };

//     const retryServerConnection = () => {
//         setServerStatus('checking');
//         checkServerStatus();
//     };

//     // ------------------- РЕНДЕР ИНДИКАТОРА СТАТУСА -------------------
//     const renderStatusIndicator = () => {
//         if (serverStatus === 'checking') {
//             return (
//                 <View style={styles.statusContainer}>
//                     <ActivityIndicator size="small" color="#666" />
//                     <Text style={styles.statusText}>Проверка сервера...</Text>
//                 </View>
//             );
//         }

//         if (serverStatus === 'offline') {
//             return (
//                 <TouchableOpacity style={styles.statusContainer} onPress={retryServerConnection}>
//                     <View style={[styles.statusDot, { backgroundColor: '#ff4444' }]} />
//                     <Text style={[styles.statusText, { color: '#ff4444' }]}>Сервер недоступен</Text>
//                     <Text style={styles.retryText}>Нажмите для повторной проверки</Text>
//                 </TouchableOpacity>
//             );
//         }

//         return (
//             <View style={styles.statusContainer}>
//                 <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
//                 <Text style={[styles.statusText, { color: '#4CAF50' }]}>✅ Сервер + API доступны</Text>
//             </View>
//         );
//     };

//     // ------------------- РЕНДЕР РЕЗУЛЬТАТА -------------------
//     const renderAnimatedResult = () => {
//         if (!capturedPhoto || !sourceRect || !targetRect) return null;

//         const translateY = moveFrameAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [sourceRect.y, targetRect.y]
//         });

//         const translateX = moveFrameAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [sourceRect.x, targetRect.x]
//         });

//         return (
//             <View style={[StyleSheet.absoluteFill, { backgroundColor: "#222" }]}> 
//                 <Animated.View
//                     style={{
//                         position: "absolute",
//                         width: sourceRect.width,
//                         height: sourceRect.height,
//                         transform: [{ translateX }, { translateY }],
//                         overflow: "hidden", 
//                         borderRadius: 4, 
//                         borderWidth: 0, 
//                         zIndex: 10
//                     }}
//                 >
//                     <Image
//                         source={{ uri: capturedPhoto }}
//                         style={{
//                             position: "absolute",
//                             width: SCREEN_WIDTH,
//                             height: SCREEN_HEIGHT,
//                             top: -sourceRect.y,
//                             left: -sourceRect.x,
//                         }}
//                         resizeMode="cover"
//                     />
                    
//                     <View style={[StyleSheet.absoluteFill, { borderWidth: 2, borderColor: 'white', borderRadius: 4 }]} />
//                 </Animated.View>
                
//                 {isProcessing && (
//                     <View style={styles.processingIndicator}>
//                         <ActivityIndicator size="large" color="#ffffff" />
//                         <Text style={styles.processingText}>Отправляем задачу в DeepSeek API...</Text>
//                         <Text style={styles.processingSubtext}>Обработка через нейросеть</Text>
//                     </View>
//                 )}
//             </View>
//         );
//     };

//     // ------------------- РЕНДЕР КАМЕРЫ -------------------
//     const renderCameraContent = () => {
//         return (
//             <View style={styles.camera}>
//                 <View style={styles.scannerOverlay}>
//                     {/* Индикатор статуса сервера */}
//                     {renderStatusIndicator()}

//                     <View
//                         ref={frameRef}
//                         style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}
//                     >
//                         <View style={styles.cornerTopLeft} />
//                         <View style={styles.cornerTopRight} />
//                         <View style={styles.cornerBottomLeft} />
//                         <View style={styles.cornerBottomRight} />

//                         {!isTakingPhoto && !capturedPhoto && !showSolutions && (
//                             <>
//                                 <View {...topResizePanResponder.panHandlers} style={styles.resizeHandleTopArea}>
//                                     <View style={styles.resizeHandleVisualHorizontal} />
//                                 </View>
//                                 <View {...bottomResizePanResponder.panHandlers} style={styles.resizeHandleBottomArea}>
//                                     <View style={styles.resizeHandleVisualHorizontal} />
//                                 </View>
//                                 <View {...leftResizePanResponder.panHandlers} style={styles.resizeHandleLeftArea}>
//                                     <View style={styles.resizeHandleVisualVertical} />
//                                 </View>
//                                 <View {...rightResizePanResponder.panHandlers} style={styles.resizeHandleRightArea}>
//                                     <View style={styles.resizeHandleVisualVertical} />
//                                 </View>
//                             </>
//                         )}

//                         <View style={styles.crosshair}>
//                             <View style={styles.crosshairVertical} />
//                             <View style={styles.crosshairHorizontal} />
//                         </View>
//                     </View>

//                     <Text style={styles.scannerText}>Наведите рамку на физическую задачу</Text>
//                     <Text style={styles.scannerSubtext}>Убедитесь, что текст хорошо виден</Text>
//                 </View>

//                 <View style={styles.cameraControls}>
//                     {!capturedPhoto && (
//                         <TouchableOpacity
//                             style={[
//                                 styles.captureButton, 
//                                 (isTakingPhoto || serverStatus === 'offline') && styles.captureButtonDisabled
//                             ]}
//                             onPress={takePicture}
//                             disabled={isTakingPhoto || serverStatus === 'offline'} 
//                         >
//                             <View style={styles.captureButtonInner} />
//                         </TouchableOpacity>
//                     )}
//                 </View>
//             </View>
//         );
//     };

//     if (!permission) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#2E86AB" />
//                 <Text style={styles.loadingText}>Загрузка разрешений...</Text>
//             </View>
//         );
//     }

//     if (!permission.granted) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.permissionText}>Нужен доступ к камере</Text>
//                 <Text style={styles.permissionSubtext}>Для работы приложения необходимо разрешение на использование камеры</Text>
//                 <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//                     <Text style={styles.permissionButtonText}>Разрешить использование камеры</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {capturedPhoto ? (
//                 renderAnimatedResult()
//             ) : (
//                 <CameraView 
//                     ref={cameraRef} 
//                     style={styles.camera} 
//                     facing="back"
//                 >
//                     {renderCameraContent()}
//                 </CameraView>
//             )}

//             {showSolutions && <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />}

//             {showSolutions && (
//                 <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
//                     <View style={styles.closeButtonBackground}>
//                         <Text style={styles.closeButtonText}>×</Text>
//                     </View>
//                 </TouchableOpacity>
//             )}

//             {showSolutions && (
//                 <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }], zIndex: 2000 }]}>
//                     {isScrolledToTop && <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />}

//                     <View style={styles.swipeIndicator}>
//                         <View style={styles.swipeLine} />
//                     </View>

//                     <ScrollView 
//                         style={styles.solutionsScroll} 
//                         contentContainerStyle={styles.scrollContent} 
//                         showsVerticalScrollIndicator={false} 
//                         onScroll={handleScroll} 
//                         scrollEventThrottle={16}
//                     >
//                         {collectedData.methods.length > 0 ? (
//                             collectedData.methods.map((m, i) => (
//                                 <View key={i} style={styles.solutionWidget}>
//                                     <Text style={styles.methodTitle}>{m.title}</Text>

//                                     <View style={styles.formulasContainer}>
//                                         <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                                         {m.formulas.map((f, fi) => (
//                                             <Text key={fi} style={styles.formulaText}>
//                                                 {f}
//                                             </Text>
//                                         ))}
//                                     </View>

//                                     <View style={styles.answerContainer}>
//                                         <Text style={styles.answerLabel}>Ответ:</Text>
//                                         <Text style={styles.answerText}>{m.answer}</Text>
//                                     </View>

//                                     <TouchableOpacity style={styles.stepsButton} onPress={() => handleShowSteps(i)}>
//                                         <Text style={styles.stepsButtonText}>📋 Показать шаги решения</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             ))
//                         ) : (
//                             <View style={styles.solutionWidget}>
//                                 <Text style={styles.methodTitle}>Решение не найдено</Text>
//                                 <Text style={styles.formulasLabel}>
//                                     DeepSeek API не смог обработать задачу. Попробуйте:
//                                 </Text>
//                                 <Text style={styles.formulaText}>
//                                     • Сфотографировать более четко{"\n"}
//                                     • Убедиться, что задача физическая{"\n"}
//                                     • Проверить баланс API ключа
//                                 </Text>
//                                 <TouchableOpacity style={styles.stepsButton} onPress={handleCloseSolutions}>
//                                     <Text style={styles.stepsButtonText}>⟲ Попробовать снова</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         )}
//                     </ScrollView>
//                 </Animated.View>
//             )}
//         </View>
//     );
// }

// // ------------------- СТИЛИ -------------------
// const styles = StyleSheet.create({
//     container: { 
//         flex: 1, 
//         backgroundColor: "black" 
//     },
//     loadingText: {
//         color: "white", 
//         fontSize: 16, 
//         textAlign: "center", 
//         marginTop: 20
//     },

//     // Статус сервера
//     statusContainer: {
//         position: 'absolute',
//         top: Platform.OS === 'ios' ? 60 : 40,
//         left: 20,
//         right: 20,
//         backgroundColor: 'rgba(0,0,0,0.7)',
//         padding: 12,
//         borderRadius: 8,
//         flexDirection: 'row',
//         alignItems: 'center',
//         zIndex: 100
//     },
//     statusDot: {
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         marginRight: 8
//     },
//     statusText: {
//         color: 'white',
//         fontSize: 14,
//         fontWeight: '600'
//     },
//     retryText: {
//         color: 'rgba(255,255,255,0.7)',
//         fontSize: 12,
//         marginLeft: 'auto'
//     },

//     // Разрешения камеры
//     permissionText: { 
//         color: "white", 
//         fontSize: 22, 
//         fontWeight: "bold",
//         textAlign: "center", 
//         marginBottom: 12 
//     },
//     permissionSubtext: {
//         color: "rgba(255,255,255,0.8)", 
//         fontSize: 16, 
//         textAlign: "center", 
//         marginBottom: 30,
//         paddingHorizontal: 20,
//         lineHeight: 22
//     },
//     permissionButton: { 
//         backgroundColor: "#2E86AB", 
//         paddingHorizontal: 30, 
//         paddingVertical: 16, 
//         borderRadius: 12 
//     },
//     permissionButtonText: { 
//         color: "white", 
//         fontSize: 18, 
//         fontWeight: "600" 
//     },

//     camera: { 
//         flex: 1 
//     },

//     scannerOverlay: { 
//         flex: 1, 
//         alignItems: "center", 
//         justifyContent: "center", 
//         paddingBottom: 100 
//     },
//     scannerFrame: {
//         borderWidth: 0,
//         borderColor: "rgba(255,255,255,0.3)",
//         backgroundColor: "transparent",
//         alignItems: "center",
//         justifyContent: "center"
//     },

//     cornerTopLeft: { 
//         position: "absolute", 
//         top: -1, 
//         left: -1, 
//         width: 20, 
//         height: 20, 
//         borderTopWidth: 3, 
//         borderLeftWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerTopRight: { 
//         position: "absolute", 
//         top: -1, 
//         right: -1, 
//         width: 20, 
//         height: 20, 
//         borderTopWidth: 3, 
//         borderRightWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerBottomLeft: { 
//         position: "absolute", 
//         bottom: -1, 
//         left: -1, 
//         width: 20, 
//         height: 20, 
//         borderBottomWidth: 3, 
//         borderLeftWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerBottomRight: { 
//         position: "absolute", 
//         bottom: -1, 
//         right: -1, 
//         width: 20, 
//         height: 20, 
//         borderBottomWidth: 3, 
//         borderRightWidth: 3, 
//         borderColor: "white" 
//     },

//     crosshair: { 
//         position: "absolute", 
//         alignItems: "center", 
//         justifyContent: "center", 
//         opacity: 0.5 
//     },
//     crosshairVertical: { 
//         width: 1, 
//         height: 15, 
//         backgroundColor: "white" 
//     },
//     crosshairHorizontal: { 
//         width: 15, 
//         height: 1, 
//         backgroundColor: "white", 
//         position: "absolute" 
//     },

//     resizeHandleTopArea: { 
//         position: "absolute", 
//         top: -20, 
//         left: 0, 
//         right: 0, 
//         height: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleBottomArea: { 
//         position: "absolute", 
//         bottom: -20, 
//         left: 0, 
//         right: 0, 
//         height: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleLeftArea: { 
//         position: "absolute", 
//         left: -20, 
//         top: 0, 
//         bottom: 0, 
//         width: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleRightArea: { 
//         position: "absolute", 
//         right: -20, 
//         top: 0, 
//         bottom: 0, 
//         width: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },

//     resizeHandleVisualHorizontal: { 
//         width: 40, 
//         height: 4, 
//         backgroundColor: "rgba(255,255,255,0.8)", 
//         borderRadius: 2 
//     },
//     resizeHandleVisualVertical: { 
//         width: 4, 
//         height: 40, 
//         backgroundColor: "rgba(255,255,255,0.8)", 
//         borderRadius: 2 
//     },

//     scannerText: { 
//         color: "white", 
//         fontSize: 18, 
//         fontWeight: "600",
//         marginTop: 30, 
//         textAlign: "center", 
//         textShadowColor: "black", 
//         textShadowRadius: 5 
//     },
//     scannerSubtext: {
//         color: "rgba(255,255,255,0.7)", 
//         fontSize: 14, 
//         marginTop: 8, 
//         textAlign: "center", 
//         textShadowColor: "black", 
//         textShadowRadius: 3
//     },

//     cameraControls: { 
//         position: "absolute", 
//         bottom: 40, 
//         left: 0, 
//         right: 0, 
//         alignItems: "center" 
//     },
//     captureButton: { 
//         width: 70, 
//         height: 70, 
//         borderRadius: 35, 
//         backgroundColor: "rgba(255,255,255,0.3)", 
//         alignItems: "center", 
//         justifyContent: "center" 
//     },
//     captureButtonDisabled: { 
//         opacity: 0.3 
//     },
//     captureButtonInner: { 
//         width: 60, 
//         height: 60, 
//         borderRadius: 30, 
//         backgroundColor: "white" 
//     },

//     processingIndicator: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(0,0,0,0.7)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 100,
//     },
//     processingText: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginTop: 20,
//         textAlign: 'center'
//     },
//     processingSubtext: {
//         color: 'rgba(255,255,255,0.7)',
//         fontSize: 14,
//         marginTop: 8,
//         textAlign: 'center'
//     },
    
//     outsideSwipeArea: { 
//         position: "absolute", 
//         top: 0, 
//         left: 0, 
//         right: 0, 
//         bottom: "40%", 
//         backgroundColor: "transparent", 
//         zIndex: 1999 
//     },
//     closeButton: { 
//         position: "absolute", 
//         top: 50, 
//         right: 20, 
//         zIndex: 2002 
//     },
//     closeButtonBackground: { 
//         width: 40, 
//         height: 40, 
//         borderRadius: 20, 
//         backgroundColor: "rgba(0, 0, 0, 0.5)", 
//         alignItems: "center", 
//         justifyContent: "center" 
//     },
//     closeButtonText: { 
//         color: "white", 
//         fontSize: 24, 
//         fontWeight: "bold", 
//         marginTop: -2 
//     },

//     solutionsContainer: { 
//         position: "absolute", 
//         bottom: 0, 
//         left: 0, 
//         right: 0, 
//         backgroundColor: "white", 
//         borderTopLeftRadius: 20, 
//         borderTopRightRadius: 20, 
//         maxHeight: `${Math.floor(BOTTOM_PANEL_RATIO * 100)}%`, 
//         zIndex: 2000 
//     },
//     overlaySwipeArea: { 
//         position: "absolute", 
//         top: 0, 
//         left: 0, 
//         right: 0, 
//         height: 60, 
//         backgroundColor: "transparent", 
//         zIndex: 2001 
//     },
//     swipeIndicator: { 
//         alignItems: "center", 
//         paddingTop: 8, 
//         paddingBottom: 8, 
//         zIndex: 2001 
//     },
//     swipeLine: { 
//         width: 40, 
//         height: 4, 
//         backgroundColor: "#ccc", 
//         borderRadius: 2 
//     },
//     solutionsScroll: { 
//         flex: 1 
//     },
//     scrollContent: { 
//         padding: 16, 
//         paddingTop: 0 
//     },

//     solutionWidget: { 
//         backgroundColor: "#f8f9fa", 
//         borderRadius: 12, 
//         padding: 20, 
//         marginBottom: 16, 
//         elevation: 3, 
//         shadowColor: "#000", 
//         shadowOffset: { width: 0, height: 2 }, 
//         shadowOpacity: 0.1, 
//         shadowRadius: 4 
//     },
//     methodTitle: { 
//         fontSize: 18, 
//         fontWeight: "bold", 
//         color: "#2c3e50", 
//         marginBottom: 12 
//     },
//     formulasContainer: { 
//         backgroundColor: "white", 
//         padding: 12, 
//         borderRadius: 8, 
//         marginBottom: 12 
//     },
//     formulasLabel: { 
//         fontSize: 14, 
//         fontWeight: "bold", 
//         color: "#2c3e50", 
//         marginBottom: 8 
//     },
//     formulaText: { 
//         fontSize: 14, 
//         color: "#2c3e50", 
//         fontFamily: "monospace", 
//         marginBottom: 6, 
//         lineHeight: 18 
//     },
//     answerContainer: { 
//         backgroundColor: "#E3F2FD", 
//         padding: 12, 
//         borderRadius: 8, 
//         marginBottom: 12, 
//         borderLeftWidth: 4, 
//         borderLeftColor: "#2196F3" 
//     },
//     answerLabel: {
//         fontSize: 14,
//         fontWeight: "bold",
//         color: "#1976D2",
//         marginBottom: 4
//     },
//     answerText: { 
//         fontSize: 16, 
//         fontWeight: "bold", 
//         color: "#1976D2", 
//         textAlign: "left" 
//     },
//     stepsButton: { 
//         backgroundColor: "#2196F3", 
//         paddingVertical: 12, 
//         paddingHorizontal: 20, 
//         borderRadius: 8, 
//         alignItems: "center" 
//     },
//     stepsButtonText: { 
//         color: "white", 
//         fontSize: 14, 
//         fontWeight: "600" 
//     }
// });






// 2Chat 









// // 111111111111111111111111111111111chat111111111111111111111111111111111chat111111111111111111111111111111111chat111111111111111111111111111111111chat111111111111111111111111111111111chat
// import React, { useRef, useState, useEffect } from "react";
// import {
//     StyleSheet,
//     View,
//     Text,
//     TouchableOpacity,
//     Alert,
//     ScrollView,
//     Animated,
//     PanResponder,
//     Image,
//     Dimensions,
//     Platform,
//     Easing,
//     ActivityIndicator
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// const BOTTOM_PANEL_RATIO = 0.45;
// const TOP_AVAILABLE_RATIO = 1 - BOTTOM_PANEL_RATIO;
// const TOP_MARGIN = Platform.OS === "android" ? 24 : 34;
// const MAX_FRAME_HEIGHT = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN - 8;

// // Адрес твоего локального Python-сервера
// const SERVER_URL = `http://192.168.0.10:5000/solve`;

// // Интерфейсы для структуры данных
// interface SolutionMethod {
//     title: string;
//     answer: string;
//     formulas: string[];
//     steps: string[];
// }

// export default function PhysicsSolver() {
//     const [permission, requestPermission] = useCameraPermissions();
//     const cameraRef = useRef<CameraView>(null);
//     const frameRef = useRef<View>(null); 

//     const [isTakingPhoto, setIsTakingPhoto] = useState(false);
//     const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
//     const [showSolutions, setShowSolutions] = useState(false);
//     const [isScrolledToTop, setIsScrolledToTop] = useState(true);
    
//     // Состояние для хранения данных от сервера
//     const [collectedData, setCollectedData] = useState<{ methods: SolutionMethod[] }>({ methods: [] });
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

//     // Анимация виджетов (снизу вверх)
//     const initialPanelTranslate = Math.floor(SCREEN_HEIGHT * BOTTOM_PANEL_RATIO);
//     const slideAnim = useRef(new Animated.Value(initialPanelTranslate)).current;
    
//     // Анимация рамки (от центра к верху)
//     const moveFrameAnim = useRef(new Animated.Value(0)).current;

//     // Храним координаты для анимации
//     const [sourceRect, setSourceRect] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
//     const [targetRect, setTargetRect] = useState<{ x: number, y: number } | null>(null);

//     const [frameSize, setFrameSize] = useState({
//         width: Math.min(300, SCREEN_WIDTH - 40),
//         height: Math.min(200, MAX_FRAME_HEIGHT)
//     });
//     const initialFrameSize = useRef({ ...frameSize });

//     // Проверка статуса сервера при загрузке
//     useEffect(() => {
//         checkServerStatus();
//     }, []);

//     const checkServerStatus = async () => {
//         try {
//             const response = await fetch(SERVER_URL.replace('/solve', '/status'), {
//                 method: 'GET',
//                 timeout: 5000
//             });
//             const result = await response.json();
            
//             if (result.success && result.api_key_valid) {
//                 setServerStatus('online');
//                 console.log('✅ Сервер работает, API ключ действителен');
//             } else {
//                 setServerStatus('offline');
//                 console.log('❌ Сервер недоступен или API ключ недействителен');
//             }
//         } catch (error) {
//             setServerStatus('offline');
//             console.log('❌ Не удалось подключиться к серверу');
//         }
//     };

//     // ------------------- ЖЕСТЫ И РЕСАЙЗ -------------------
//     const swipePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > Math.abs(g.dx),
//             onPanResponderMove: (_, g) => {
//                 if (g.dy > 0) slideAnim.setValue(g.dy);
//             },
//             onPanResponderRelease: (_, g) => {
//                 if (g.dy > 80) {
//                     handleCloseWithAlert();
//                 } else {
//                     Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
//                 }
//             }
//         })
//     ).current;

//     const MIN_SIZE = 100;
//     const MAX_WIDTH = SCREEN_WIDTH - 40;
//     const MAX_HEIGHT = MAX_FRAME_HEIGHT;

//     const handleResizeStart = () => {
//         initialFrameSize.current = { ...frameSize };
//     };

//     const topResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newHeight = Math.min(
//                     MAX_HEIGHT,
//                     Math.max(MIN_SIZE, initialFrameSize.current.height - g.dy * 2)
//                 );
//                 setFrameSize((p) => ({ ...p, height: newHeight }));
//             }
//         })
//     ).current;

//     const bottomResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newHeight = Math.min(
//                     MAX_HEIGHT,
//                     Math.max(MIN_SIZE, initialFrameSize.current.height + g.dy * 2)
//                 );
//                 setFrameSize((p) => ({ ...p, height: newHeight }));
//             }
//         })
//     ).current;

//     const leftResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width - g.dx * 2));
//                 setFrameSize((p) => ({ ...p, width: newWidth }));
//             }
//         })
//     ).current;

//     const rightResizePanResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => !isTakingPhoto && !showSolutions,
//             onPanResponderGrant: handleResizeStart,
//             onPanResponderMove: (_, g) => {
//                 const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_SIZE, initialFrameSize.current.width + g.dx * 2));
//                 setFrameSize((p) => ({ ...p, width: newWidth }));
//             }
//         })
//     ).current;

//     // ------------------- ЛОГИКА ФОТОГРАФИРОВАНИЯ -------------------
//     const takePicture = async () => {
//         if (!cameraRef.current || !frameRef.current) return;
        
//         // Проверяем статус сервера перед съемкой
//         if (serverStatus === 'offline') {
//             Alert.alert(
//                 "Сервер недоступен", 
//                 "Проверьте:\n1. Запущен ли server.py на компьютере\n2. Корректный ли API ключ в server.py\n3. Правильный ли IP-адрес в настройках",
//                 [{ text: "Понятно" }]
//             );
//             return;
//         }

//         setIsTakingPhoto(true);
//         setIsProcessing(true); 

//         try {
//             let currentSourceRect = null as { x: number, y: number, width: number, height: number } | null;

//             // Получаем координаты рамки
//             await new Promise<void>((resolve, reject) => {
//                 if (!frameRef.current) {
//                     reject(new Error("Frame ref not available"));
//                     return;
//                 }

//                 // @ts-ignore
//                 frameRef.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
//                     currentSourceRect = { x: px, y: py, width, height };
//                     setSourceRect(currentSourceRect);

//                     const availableHeight = Math.floor(SCREEN_HEIGHT * TOP_AVAILABLE_RATIO) - TOP_MARGIN;
//                     const targetY = TOP_MARGIN + (availableHeight - height) / 2;
//                     const targetX = (SCREEN_WIDTH - width) / 2;
                    
//                     setTargetRect({ x: targetX, y: targetY });
//                     resolve();
//                 });
//             });

//             if (!currentSourceRect) {
//                 throw new Error("Не удалось измерить позицию рамки.");
//             }

//             // Делаем фото
//             console.log("📸 Делаем фото...");
//             const photo = await cameraRef.current.takePictureAsync({ 
//                 skipProcessing: false,
//                 base64: true,
//                 quality: 0.8,
//                 exif: true, // <--- ИЗМЕНЕНО: Включен EXIF для корректной ориентации на сервере
                
//             });
            
//             if (!photo || !photo.base64) {
//                 throw new Error("Камера не вернула фото в base64");
//             }

//             setCapturedPhoto(photo.uri);
//             console.log("✅ Фото сделано, отправляем на сервер...");

//             // ОТПРАВЛЯЕМ КООРДИНАТЫ РАМКИ ДЛЯ ОБРЕЗКИ
//             const requestData = {
//                 image: photo.base64,
//                 frame_rect: {
//                     x: currentSourceRect.x,
//                     y: currentSourceRect.y, 
//                     width: currentSourceRect.width,
//                     height: currentSourceRect.height
//                 },
//                 screen_width: SCREEN_WIDTH,
//                 screen_height: SCREEN_HEIGHT
//             };

//             // Отправляем на сервер с таймаутом
//             const controller = new AbortController();
//             const timeoutId = setTimeout(() => controller.abort(), 120000);

//             const response = await fetch(SERVER_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(requestData),
//                 signal: controller.signal
//             });

//             clearTimeout(timeoutId);

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const result = await response.json();
//             console.log("📡 Ответ от сервера:", result);

//             // Обрабатываем ответ
//             if (result && result.success && Array.isArray(result.solutions)) {
//                 setCollectedData({ methods: result.solutions });
//                 console.log(`✅ Получено ${result.solutions.length} решений от DeepSeek API`);
//             } else {
//                 throw new Error(result.message || "Сервер не вернул решения");
//             }

//             // Запускаем анимации успеха
//             setTimeout(() => {
//                 setIsTakingPhoto(false);
//                 setIsProcessing(false); 
//                 setShowSolutions(true);
                
//                 Animated.parallel([
//                     Animated.timing(slideAnim, { 
//                         toValue: 0, 
//                         duration: 420, 
//                         useNativeDriver: true,
//                         easing: Easing.out(Easing.cubic) 
//                     }),
//                     Animated.timing(moveFrameAnim, {
//                         toValue: 1,
//                         duration: 420,
//                         useNativeDriver: true,
//                         easing: Easing.out(Easing.cubic) 
//                     })
//                 ]).start();
//             }, 100);

//         } catch (err: any) {
//             console.error("❌ Ошибка:", err);
            
//             let errorMessage = "Неизвестная ошибка";
//             if (err.name === 'AbortError') {
//                 errorMessage = "Таймаут запроса (2 минуты). Проверьте сервер.";
//             } else if (err.message) {
//                 errorMessage = err.message;
//             }

//             Alert.alert(
//                 "Ошибка", 
//                 `${errorMessage}\n\nПроверьте:\n• Запущен ли server.py\n• Корректный ли API ключ\n• Стабильно ли интернет-соединение`
//             );
            
//             setIsTakingPhoto(false);
//             setIsProcessing(false);
//             setCapturedPhoto(null);
//             setSourceRect(null); 
//             setTargetRect(null);
//         }
//     };

//     const handleCloseSolutions = () => {
//         Animated.parallel([
//             Animated.timing(slideAnim, { toValue: initialPanelTranslate, duration: 250, useNativeDriver: true }),
//             Animated.timing(moveFrameAnim, { toValue: 0, duration: 250, useNativeDriver: true })
//         ]).start(() => {
//             setShowSolutions(false);
//             setCapturedPhoto(null);
//             setSourceRect(null);
//             setTargetRect(null);
//             setCollectedData({ methods: [] });
//         });
//     };

//     const handleCloseWithAlert = () => {
//         Alert.alert("Вернуться?", "Хотите вернуться к камере?", [
//             {
//                 text: "Отмена",
//                 style: "cancel",
//                 onPress: () => Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start()
//             },
//             { text: "Да", onPress: handleCloseSolutions }
//         ]);
//     };

//     const handleShowSteps = (index: number) => {
//         if (collectedData.methods[index] && collectedData.methods[index].steps) {
//             Alert.alert(
//                 collectedData.methods[index].title, 
//                 collectedData.methods[index].steps.join("\n\n"),
//                 [{ text: "Закрыть", style: "cancel" }]
//             );
//         }
//     };

//     const handleScroll = (e: any) => {
//         setIsScrolledToTop(e.nativeEvent.contentOffset.y <= 10);
//     };

//     const retryServerConnection = () => {
//         setServerStatus('checking');
//         checkServerStatus();
//     };

//     // ------------------- РЕНДЕР ИНДИКАТОРА СТАТУСА -------------------
//     const renderStatusIndicator = () => {
//         if (serverStatus === 'checking') {
//             return (
//                 <View style={styles.statusContainer}>
//                     <ActivityIndicator size="small" color="#666" />
//                     <Text style={styles.statusText}>Проверка сервера...</Text>
//                 </View>
//             );
//         }

//         if (serverStatus === 'offline') {
//             return (
//                 <TouchableOpacity style={styles.statusContainer} onPress={retryServerConnection}>
//                     <View style={[styles.statusDot, { backgroundColor: '#ff4444' }]} />
//                     <Text style={[styles.statusText, { color: '#ff4444' }]}>Сервер недоступен</Text>
//                     <Text style={styles.retryText}>Нажмите для повторной проверки</Text>
//                 </TouchableOpacity>
//             );
//         }

//         return (
//             <View style={styles.statusContainer}>
//                 <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
//                 <Text style={[styles.statusText, { color: '#4CAF50' }]}>✅ Сервер + API доступны</Text>
//             </View>
//         );
//     };

//     // ------------------- РЕНДЕР РЕЗУЛЬТАТА -------------------
//     const renderAnimatedResult = () => {
//         if (!capturedPhoto || !sourceRect || !targetRect) return null;

//         const translateY = moveFrameAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [sourceRect.y, targetRect.y]
//         });

//         const translateX = moveFrameAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [sourceRect.x, targetRect.x]
//         });

//         return (
//             <View style={[StyleSheet.absoluteFill, { backgroundColor: "#222" }]}> 
//                 <Animated.View
//                     style={{
//                         position: "absolute",
//                         width: sourceRect.width,
//                         height: sourceRect.height,
//                         transform: [{ translateX }, { translateY }],
//                         overflow: "hidden", 
//                         borderRadius: 4, 
//                         borderWidth: 0, 
//                         zIndex: 10
//                     }}
//                 >
//                     <Image
//                         source={{ uri: capturedPhoto }}
//                         style={{
//                             position: "absolute",
//                             width: SCREEN_WIDTH,
//                             height: SCREEN_HEIGHT,
//                             top: -sourceRect.y,
//                             left: -sourceRect.x,
//                         }}
//                         resizeMode="cover"
//                     />
                    
//                     <View style={[StyleSheet.absoluteFill, { borderWidth: 2, borderColor: 'white', borderRadius: 4 }]} />
//                 </Animated.View>
                
//                 {isProcessing && (
//                     <View style={styles.processingIndicator}>
//                         <ActivityIndicator size="large" color="#ffffff" />
//                         <Text style={styles.processingText}>Отправляем задачу в DeepSeek API...</Text>
//                         <Text style={styles.processingSubtext}>Обработка через нейросеть</Text>
//                     </View>
//                 )}
//             </View>
//         );
//     };

//     // ------------------- РЕНДЕР КАМЕРЫ -------------------
//     const renderCameraContent = () => {
//         return (
//             <View style={styles.camera}>
//                 <View style={styles.scannerOverlay}>
//                     {/* Индикатор статуса сервера */}
//                     {renderStatusIndicator()}

//                     <View
//                         ref={frameRef}
//                         style={[styles.scannerFrame, { width: frameSize.width, height: frameSize.height }]}
//                     >
//                         <View style={styles.cornerTopLeft} />
//                         <View style={styles.cornerTopRight} />
//                         <View style={styles.cornerBottomLeft} />
//                         <View style={styles.cornerBottomRight} />

//                         {!isTakingPhoto && !capturedPhoto && !showSolutions && (
//                             <>
//                                 <View {...topResizePanResponder.panHandlers} style={styles.resizeHandleTopArea}>
//                                     <View style={styles.resizeHandleVisualHorizontal} />
//                                 </View>
//                                 <View {...bottomResizePanResponder.panHandlers} style={styles.resizeHandleBottomArea}>
//                                     <View style={styles.resizeHandleVisualHorizontal} />
//                                 </View>
//                                 <View {...leftResizePanResponder.panHandlers} style={styles.resizeHandleLeftArea}>
//                                     <View style={styles.resizeHandleVisualVertical} />
//                                 </View>
//                                 <View {...rightResizePanResponder.panHandlers} style={styles.resizeHandleRightArea}>
//                                     <View style={styles.resizeHandleVisualVertical} />
//                                 </View>
//                             </>
//                         )}

//                         <View style={styles.crosshair}>
//                             <View style={styles.crosshairVertical} />
//                             <View style={styles.crosshairHorizontal} />
//                         </View>
//                     </View>

//                     <Text style={styles.scannerText}>Наведите рамку на физическую задачу</Text>
//                     <Text style={styles.scannerSubtext}>Убедитесь, что текст хорошо виден</Text>
//                 </View>

//                 <View style={styles.cameraControls}>
//                     {!capturedPhoto && (
//                         <TouchableOpacity
//                             style={[
//                                 styles.captureButton, 
//                                 (isTakingPhoto || serverStatus === 'offline') && styles.captureButtonDisabled
//                             ]}
//                             onPress={takePicture}
//                             disabled={isTakingPhoto || serverStatus === 'offline'} 
//                         >
//                             <View style={styles.captureButtonInner} />
//                         </TouchableOpacity>
//                     )}
//                 </View>
//             </View>
//         );
//     };

//     if (!permission) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#2E86AB" />
//                 <Text style={styles.loadingText}>Загрузка разрешений...</Text>
//             </View>
//         );
//     }

//     if (!permission.granted) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.permissionText}>Нужен доступ к камере</Text>
//                 <Text style={styles.permissionSubtext}>Для работы приложения необходимо разрешение на использование камеры</Text>
//                 <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//                     <Text style={styles.permissionButtonText}>Разрешить использование камеры</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {capturedPhoto ? (
//                 renderAnimatedResult()
//             ) : (
//                 <CameraView 
//                     ref={cameraRef} 
//                     style={styles.camera} 
//                     facing="back"
//                 >
//                     {renderCameraContent()}
//                 </CameraView>
//             )}

//             {showSolutions && <View style={styles.outsideSwipeArea} {...swipePanResponder.panHandlers} />}

//             {showSolutions && (
//                 <TouchableOpacity style={styles.closeButton} onPress={handleCloseWithAlert}>
//                     <View style={styles.closeButtonBackground}>
//                         <Text style={styles.closeButtonText}>×</Text>
//                     </View>
//                 </TouchableOpacity>
//             )}

//             {showSolutions && (
//                 <Animated.View style={[styles.solutionsContainer, { transform: [{ translateY: slideAnim }], zIndex: 2000 }]}>
//                     {isScrolledToTop && <View style={styles.overlaySwipeArea} {...swipePanResponder.panHandlers} />}

//                     <View style={styles.swipeIndicator}>
//                         <View style={styles.swipeLine} />
//                     </View>

//                     <ScrollView 
//                         style={styles.solutionsScroll} 
//                         contentContainerStyle={styles.scrollContent} 
//                         showsVerticalScrollIndicator={false} 
//                         onScroll={handleScroll} 
//                         scrollEventThrottle={16}
//                     >
//                         {collectedData.methods.length > 0 ? (
//                             collectedData.methods.map((m, i) => (
//                                 <View key={i} style={styles.solutionWidget}>
//                                     <Text style={styles.methodTitle}>{m.title}</Text>

//                                     <View style={styles.formulasContainer}>
//                                         <Text style={styles.formulasLabel}>Ключевые формулы</Text>
//                                         {m.formulas.map((f, fi) => (
//                                             <Text key={fi} style={styles.formulaText}>
//                                                 {f}
//                                             </Text>
//                                         ))}
//                                     </View>

//                                     <View style={styles.answerContainer}>
//                                         <Text style={styles.answerLabel}>Ответ:</Text>
//                                         <Text style={styles.answerText}>{m.answer}</Text>
//                                     </View>

//                                     <TouchableOpacity style={styles.stepsButton} onPress={() => handleShowSteps(i)}>
//                                         <Text style={styles.stepsButtonText}>📋 Показать шаги решения</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             ))
//                         ) : (
//                             <View style={styles.solutionWidget}>
//                                 <Text style={styles.methodTitle}>Решение не найдено</Text>
//                                 <Text style={styles.formulasLabel}>
//                                     DeepSeek API не смог обработать задачу. Попробуйте:
//                                 </Text>
//                                 <Text style={styles.formulaText}>
//                                     • Сфотографировать более четко{"\n"}
//                                     • Убедиться, что задача физическая{"\n"}
//                                     • Проверить баланс API ключа
//                                 </Text>
//                                 <TouchableOpacity style={styles.stepsButton} onPress={handleCloseSolutions}>
//                                     <Text style={styles.stepsButtonText}>⟲ Попробовать снова</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         )}
//                     </ScrollView>
//                 </Animated.View>
//             )}
//         </View>
//     );
// }

// // ------------------- СТИЛИ -------------------
// const styles = StyleSheet.create({
//     container: { 
//         flex: 1, 
//         backgroundColor: "black" 
//     },
//     loadingText: {
//         color: "white", 
//         fontSize: 16, 
//         textAlign: "center", 
//         marginTop: 20
//     },

//     // Статус сервера
//     statusContainer: {
//         position: 'absolute',
//         top: Platform.OS === 'ios' ? 60 : 40,
//         left: 20,
//         right: 20,
//         backgroundColor: 'rgba(0,0,0,0.7)',
//         padding: 12,
//         borderRadius: 8,
//         flexDirection: 'row',
//         alignItems: 'center',
//         zIndex: 100
//     },
//     statusDot: {
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         marginRight: 8
//     },
//     statusText: {
//         color: 'white',
//         fontSize: 14,
//         fontWeight: '600'
//     },
//     retryText: {
//         color: 'rgba(255,255,255,0.7)',
//         fontSize: 12,
//         marginLeft: 'auto'
//     },

//     // Разрешения камеры
//     permissionText: { 
//         color: "white", 
//         fontSize: 22, 
//         fontWeight: "bold",
//         textAlign: "center", 
//         marginBottom: 12 
//     },
//     permissionSubtext: {
//         color: "rgba(255,255,255,0.8)", 
//         fontSize: 16, 
//         textAlign: "center", 
//         marginBottom: 30,
//         paddingHorizontal: 20,
//         lineHeight: 22
//     },
//     permissionButton: { 
//         backgroundColor: "#2E86AB", 
//         paddingHorizontal: 30, 
//         paddingVertical: 16, 
//         borderRadius: 12 
//     },
//     permissionButtonText: { 
//         color: "white", 
//         fontSize: 18, 
//         fontWeight: "600" 
//     },

//     camera: { 
//         flex: 1 
//     },

//     scannerOverlay: { 
//         flex: 1, 
//         alignItems: "center", 
//         justifyContent: "center", 
//         paddingBottom: 100 
//     },
//     scannerFrame: {
//         borderWidth: 0,
//         borderColor: "rgba(255,255,255,0.3)",
//         backgroundColor: "transparent",
//         alignItems: "center",
//         justifyContent: "center"
//     },

//     cornerTopLeft: { 
//         position: "absolute", 
//         top: -1, 
//         left: -1, 
//         width: 20, 
//         height: 20, 
//         borderTopWidth: 3, 
//         borderLeftWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerTopRight: { 
//         position: "absolute", 
//         top: -1, 
//         right: -1, 
//         width: 20, 
//         height: 20, 
//         borderTopWidth: 3, 
//         borderRightWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerBottomLeft: { 
//         position: "absolute", 
//         bottom: -1, 
//         left: -1, 
//         width: 20, 
//         height: 20, 
//         borderBottomWidth: 3, 
//         borderLeftWidth: 3, 
//         borderColor: "white" 
//     },
//     cornerBottomRight: { 
//         position: "absolute", 
//         bottom: -1, 
//         right: -1, 
//         width: 20, 
//         height: 20, 
//         borderBottomWidth: 3, 
//         borderRightWidth: 3, 
//         borderColor: "white" 
//     },

//     crosshair: { 
//         position: "absolute", 
//         alignItems: "center", 
//         justifyContent: "center", 
//         opacity: 0.5 
//     },
//     crosshairVertical: { 
//         width: 1, 
//         height: 15, 
//         backgroundColor: "white" 
//     },
//     crosshairHorizontal: { 
//         width: 15, 
//         height: 1, 
//         backgroundColor: "white", 
//         position: "absolute" 
//     },

//     resizeHandleTopArea: { 
//         position: "absolute", 
//         top: -20, 
//         left: 0, 
//         right: 0, 
//         height: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleBottomArea: { 
//         position: "absolute", 
//         bottom: -20, 
//         left: 0, 
//         right: 0, 
//         height: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleLeftArea: { 
//         position: "absolute", 
//         left: -20, 
//         top: 0, 
//         bottom: 0, 
//         width: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },
//     resizeHandleRightArea: { 
//         position: "absolute", 
//         right: -20, 
//         top: 0, 
//         bottom: 0, 
//         width: 40, 
//         justifyContent: "center", 
//         alignItems: "center", 
//         zIndex: 10 
//     },

//     resizeHandleVisualHorizontal: { 
//         width: 40, 
//         height: 4, 
//         backgroundColor: "rgba(255,255,255,0.8)", 
//         borderRadius: 2 
//     },
//     resizeHandleVisualVertical: { 
//         width: 4, 
//         height: 40, 
//         backgroundColor: "rgba(255,255,255,0.8)", 
//         borderRadius: 2 
//     },

//     scannerText: { 
//         color: "white", 
//         fontSize: 18, 
//         fontWeight: "600",
//         marginTop: 30, 
//         textAlign: "center", 
//         textShadowColor: "black", 
//         textShadowRadius: 5 
//     },
//     scannerSubtext: {
//         color: "rgba(255,255,255,0.7)", 
//         fontSize: 14, 
//         marginTop: 8, 
//         textAlign: "center", 
//         textShadowColor: "black", 
//         textShadowRadius: 3
//     },

//     cameraControls: { 
//         position: "absolute", 
//         bottom: 40, 
//         left: 0, 
//         right: 0, 
//         alignItems: "center" 
//     },
//     captureButton: { 
//         width: 70, 
//         height: 70, 
//         borderRadius: 35, 
//         backgroundColor: "rgba(255,255,255,0.3)", 
//         alignItems: "center", 
//         justifyContent: "center" 
//     },
//     captureButtonDisabled: { 
//         opacity: 0.3 
//     },
//     captureButtonInner: { 
//         width: 60, 
//         height: 60, 
//         borderRadius: 30, 
//         backgroundColor: "white" 
//     },

//     processingIndicator: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(0,0,0,0.7)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 100,
//     },
//     processingText: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginTop: 20,
//         textAlign: 'center'
//     },
//     processingSubtext: {
//         color: 'rgba(255,255,255,0.7)',
//         fontSize: 14,
//         marginTop: 8,
//         textAlign: 'center'
//     },
    
//     outsideSwipeArea: { 
//         position: "absolute", 
//         top: 0, 
//         left: 0, 
//         right: 0, 
//         bottom: "40%", 
//         backgroundColor: "transparent", 
//         zIndex: 1999 
//     },
//     closeButton: { 
//         position: "absolute", 
//         top: 50, 
//         right: 20, 
//         zIndex: 2002 
//     },
//     closeButtonBackground: { 
//         width: 40, 
//         height: 40, 
//         borderRadius: 20, 
//         backgroundColor: "rgba(0, 0, 0, 0.5)", 
//         alignItems: "center", 
//         justifyContent: "center" 
//     },
//     closeButtonText: { 
//         color: "white", 
//         fontSize: 24, 
//         fontWeight: "bold", 
//         marginTop: -2 
//     },

//     solutionsContainer: { 
//         position: "absolute", 
//         bottom: 0, 
//         left: 0, 
//         right: 0, 
//         backgroundColor: "white", 
//         borderTopLeftRadius: 20, 
//         borderTopRightRadius: 20, 
//         maxHeight: `${Math.floor(BOTTOM_PANEL_RATIO * 100)}%`, 
//         zIndex: 2000 
//     },
//     overlaySwipeArea: { 
//         position: "absolute", 
//         top: 0, 
//         left: 0, 
//         right: 0, 
//         height: 60, 
//         backgroundColor: "transparent", 
//         zIndex: 2001 
//     },
//     swipeIndicator: { 
//         alignItems: "center", 
//         paddingTop: 8, 
//         paddingBottom: 8, 
//         zIndex: 2001 
//     },
//     swipeLine: { 
//         width: 40, 
//         height: 4, 
//         backgroundColor: "#ccc", 
//         borderRadius: 2 
//     },
//     solutionsScroll: { 
//         flex: 1 
//     },
//     scrollContent: { 
//         padding: 16, 
//         paddingTop: 0 
//     },

//     solutionWidget: { 
//         backgroundColor: "#f8f9fa", 
//         borderRadius: 12, 
//         padding: 20, 
//         marginBottom: 16, 
//         elevation: 3, 
//         shadowColor: "#000", 
//         shadowOffset: { width: 0, height: 2 }, 
//         shadowOpacity: 0.1, 
//         shadowRadius: 4 
//     },
//     methodTitle: { 
//         fontSize: 18, 
//         fontWeight: "bold", 
//         color: "#2c3e50", 
//         marginBottom: 12 
//     },
//     formulasContainer: { 
//         backgroundColor: "white", 
//         padding: 12, 
//         borderRadius: 8, 
//         marginBottom: 12 
//     },
//     formulasLabel: { 
//         fontSize: 14, 
//         fontWeight: "bold", 
//         color: "#2c3e50", 
//         marginBottom: 8 
//     },
//     formulaText: { 
//         fontSize: 14, 
//         color: "#2c3e50", 
//         fontFamily: "monospace", 
//         marginBottom: 6, 
//         lineHeight: 18 
//     },
//     answerContainer: { 
//         backgroundColor: "#E3F2FD", 
//         padding: 12, 
//         borderRadius: 8, 
//         marginBottom: 12, 
//         borderLeftWidth: 4, 
//         borderLeftColor: "#2196F3" 
//     },
//     answerLabel: {
//         fontSize: 14,
//         fontWeight: "bold",
//         color: "#1976D2",
//         marginBottom: 4
//     },
//     answerText: { 
//         fontSize: 16, 
//         fontWeight: "bold", 
//         color: "#1976D2", 
//         textAlign: "left" 
//     },
//     stepsButton: { 
//         backgroundColor: "#2196F3", 
//         paddingVertical: 12, 
//         paddingHorizontal: 20, 
//         borderRadius: 8, 
//         alignItems: "center" 
//     },
//     stepsButtonText: { 
//         color: "white", 
//         fontSize: 14, 
//         fontWeight: "600" 
//     }
// });


// main


