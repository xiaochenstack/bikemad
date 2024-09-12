import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // 用于在本地设备上持久化存储数据

const ReservasScreen = () => {
  // 定义状态，用于存储已经预订的自行车
  const [reservedBikes, setReservedBikes] = useState([]);

  // 当组件首次加载时获取已预订的自行车数据
  useEffect(() => {
    fetchReservedBikes();  // 调用函数获取已预订的自行车
  }, []);

  // 从 AsyncStorage 中获取已预订自行车的 ID，并通过 API 获取详细信息
  const fetchReservedBikes = async () => {
    try {
      // 从本地存储获取预订的自行车 ID 列表
      const reservedBikeIds = await AsyncStorage.getItem('MyreservedBike');
      if (reservedBikeIds) {
        const ids = JSON.parse(reservedBikeIds);  // 将存储的字符串解析为数组
        if (Array.isArray(ids)) {
          // 异步获取每辆自行车的详细信息
          const bikesData = await Promise.all(
            ids.map(async (bikeId) => {
              // 根据自行车 ID 获取详细信息
              const response = await fetch(`https://bikemad-api.vercel.app/bikes/${bikeId}`);
              return response.json();  // 将响应转换为 JSON
            })
          );
          setReservedBikes(bikesData);  // 更新状态，存储已预订自行车的详细信息
        } else {
          setReservedBikes([]);  // 如果不是有效数组，则设置为空
        }
      } else {
        setReservedBikes([]);  // 如果没有预订的自行车，状态也设置为空
      }
    } catch (error) {
      console.error(error);  // 捕捉并打印错误
    }
  };

  // 取消自行车预订的函数
  const cancelReservation = async (bikeId) => {
    try {
      // 从 AsyncStorage 获取预订的自行车 ID
      const reservedBikeIds = await AsyncStorage.getItem('MyreservedBike');
      if (reservedBikeIds) {
        const ids = JSON.parse(reservedBikeIds);  // 将其转换为数组
        const updatedIds = ids.filter((id) => id !== bikeId);  // 过滤掉要取消的自行车 ID
        await AsyncStorage.setItem('MyreservedBike', JSON.stringify(updatedIds));  // 更新本地存储
        fetchReservedBikes();  // 重新获取已预订的自行车数据
        Alert.alert('Reservation Canceled');  // 弹出提示框，告知用户预订已取消
      }
    } catch (error) {
      console.error(error);  // 捕捉并打印错误
    }
  };

  // 手动刷新已预订自行车列表的函数
  const refreshData = () => {
    fetchReservedBikes();  // 调用获取预订自行车的函数
  };

  return (
    <View style={styles.container}>
      {/* 头部视图，包含标题和刷新按钮 */}
      <View style={styles.header}>
        <Text style={styles.heading}>Reserved Bikes</Text>
        <Button title="Refresh" onPress={refreshData} />  // 刷新按钮，用于手动刷新数据
      </View>
      
      {/* 如果有预订的自行车，显示列表，否则显示提示信息 */}
      {reservedBikes.length > 0 ? (
        <FlatList
          data={reservedBikes}  // 渲染的数据为已预订的自行车
          keyExtractor={(item) => item.id.toString()}  // 为每项指定唯一键
          renderItem={({ item }) => (
            <View style={styles.bikeItem}>
              <Text>{item.brand} {item.model}</Text>  // 显示自行车品牌和型号
              <Text>{item.type}</Text>  // 显示自行车类型
              <Text>{item.latitude}</Text>  // 显示自行车位置的纬度
              <Text>{item.longitude}</Text>  // 显示自行车位置的经度
              {/* 取消预订按钮，点击时调用 cancelReservation 函数 */}
              <Button title="Cancel Reservation" onPress={() => cancelReservation(item.id)} />
            </View>
          )}
        />
      ) : (
        <Text>No bikes reserved</Text>  // 如果没有预订的自行车，显示提示信息
      )}
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,  // 占据整个屏幕
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',  // 水平排列
    justifyContent: 'space-between',  // 标题和按钮在两侧对齐
    alignItems: 'center',
    marginBottom: 10,  // 标题与列表之间的间距
  },
  heading: {
    fontSize: 20,  // 标题的字体大小
    fontWeight: 'bold',  // 加粗标题
  },
  bikeItem: {
    flexDirection: 'column',  // 列排列
    justifyContent: 'space-between',  // 在列中垂直对齐
    alignItems: 'flex-start',  // 左对齐文本
    padding: 10,  // 项目的内边距
    borderBottomWidth: 1,  // 为每个项添加底部边框
    borderBottomColor: '#ccc',  // 边框颜色
  },
});

export default ReservasScreen;
