import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 导入用于在设备上持久化存储数据的库

// 这是一个接收 `route` 和 `navigation` 参数的 React 组件，
// `route` 包含传递的参数，`navigation` 用于在屏幕之间导航
const DetailsScreen = ({ route, navigation }) => {
    const { bikeDetails } = route.params;  // 从 route.params 中解构出 `bikeDetails`，它是从上一屏传递来的自行车详情
    const [isReserved, setIsReserved] = useState(false); // 使用 useState hook 定义一个状态变量 isReserved，用于标记自行车是否被预定

    // 使用 useEffect 在组件加载时调用 checkReservationStatus 函数
    useEffect(() => {
      checkReservationStatus(); // 检查当前自行车是否已被预定
    }, []);  // 空数组表示这个 effect 只在组件挂载时执行一次

    // 异步函数：检查该自行车是否已经被预定
    const checkReservationStatus = async () => {
        try {
          // 从自行车详情中获取 `reserved` 状态（是否被预定）
          const isBikeReserved = bikeDetails.reserved;

          // 从 AsyncStorage 中获取预定的自行车 ID 列表
          const reservedBikeIds = await AsyncStorage.getItem('MyreservedBike');
          // 如果有预定的数据则将其解析为数组，否则初始化为空数组
          const reservedBikeIdsArray = JSON.parse(reservedBikeIds) || [];
          // 检查当前自行车的 ID 是否在已预定列表中
          const isBikeIdInReservedList = reservedBikeIdsArray.includes(bikeDetails.id);

          // 如果该自行车已被预定或者在已预定列表中，则更新 isReserved 状态为 true
          setIsReserved(isBikeReserved || isBikeIdInReservedList);
        } catch (error) {
          console.error(error);  // 捕捉并打印任何错误
        }
    };
    
    // 异步函数：预定自行车
    const reserveBike = async () => {
        try {
          // 从 AsyncStorage 中获取已预定的自行车 ID 列表
          const reservedBikeIds = await AsyncStorage.getItem('MyreservedBike');
          let updatedIds = [];
          if (reservedBikeIds) {
            // 如果有数据，将其解析为数组
            updatedIds = JSON.parse(reservedBikeIds);
          }
          // 将当前自行车的 ID 添加到预定列表中
          updatedIds.push(bikeDetails.id);
          // 将更新后的预定列表存储回 AsyncStorage 中
          await AsyncStorage.setItem('MyreservedBike', JSON.stringify(updatedIds));
          setIsReserved(true); // 更新组件的状态，标记该自行车为已预定
          Alert.alert('Bike Reserved', 'You have successfully reserved this bike.'); // 显示成功预定的弹窗
          navigation.navigate('reservas'); // 导航到 "reservas" 页面（假设这是显示所有预定信息的页面）
        } catch (error) {
          console.error(error);  // 捕捉并打印任何错误
        }
    };

    return (
      <View style={styles.container}>
        {/* 显示自行车的详细信息 */}
        <Text>Brand: {bikeDetails.brand}</Text>
        <Text>Model: {bikeDetails.model}</Text>
        <Text>Type: {bikeDetails.type}</Text>
        <Text>Model: {bikeDetails.model}</Text>
        
        {/* 根据 isReserved 状态判断按钮的显示 */}
        {isReserved ? (
          <View>
            <Text style={styles.warningText}>This bike is already reserved.</Text> 
            {/* 如果该自行车已预定，则显示一个提示信息，并提供前往 "MyreservedBike" 页面查看预定的按钮 */}
            <Button title="Go to MyreservedBike" onPress={() => navigation.navigate('reservas')} />
          </View>
        ) : (
          <View>
            {/* 如果自行车没有被预定，显示 "Reserve Bike" 按钮，点击时调用 reserveBike 函数 */}
            <Button title="Reserve Bike" onPress={reserveBike} />
          </View>
        )}
      </View>
    );
  };
  
// 定义用于样式的对象
const styles = StyleSheet.create({
  container: {
    flex: 1,  // 让容器填满整个屏幕
    alignItems: 'center',  // 水平居中
    justifyContent: 'center',  // 垂直居中
  },
  warningText: {
    color: 'red',  // 红色文本，用于提示已预定状态
    marginTop: 10,  // 设置上边距
  },
});

// 导出 DetailsScreen 组件，以便其他地方使用
export default DetailsScreen;
