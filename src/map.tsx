import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';  // 导入地图组件和标记组件
import AsyncStorage from '@react-native-async-storage/async-storage';  // 用于持久化存储数据的库
import { Picker } from '@react-native-picker/picker';  // 导入选择器组件，用于用户选择自行车类型

const MapScreen = ({ navigation }) => {
  // 定义两个状态：
  const [bikeLocations, setBikeLocations] = useState([]);  // 用于存储从 API 获取的所有自行车数据
  const [selectedType, setSelectedType] = useState('all');  // 用于存储用户选择的自行车类型

  // 从 API 获取自行车数据的异步函数
  const fetchBikeData = async () => {
    try {
      // 发起网络请求，获取自行车数据
      const response = await fetch('https://bikemad-api.vercel.app/bikes');
      const bikeData = await response.json();  // 将响应数据转换为 JSON 格式
      setBikeLocations(bikeData);  // 将自行车数据存储到状态变量中
    } catch (error) {
      console.error(error);  // 捕捉并打印任何错误
    }
  };

  // useEffect 钩子：在组件挂载时调用 fetchBikeData 函数
  useEffect(() => {
    fetchBikeData();  // 获取自行车数据
  }, []);  // 空依赖数组，确保只在组件首次加载时调用

  // 根据用户选择的自行车类型过滤自行车列表
  const filterBikesByType = () => {
    if (selectedType === 'all') {
      return bikeLocations;  // 如果选择的是 "all"，则返回所有自行车
    } else {
      return bikeLocations.filter((bike) => bike.type === selectedType);  // 否则返回匹配类型的自行车
    }
  };

  // 根据自行车类型返回相应的标记颜色
  const getPinColorByType = (type) => {
    switch (type) {
      case 'Electric':
        return 'blue';  // 电动自行车的标记颜色为蓝色
      case 'Mountain':
        return 'green';  // 山地自行车的标记颜色为绿色
      case 'Road':
        return 'yellow';  // 公路自行车的标记颜色为黄色
      default:
        return 'red';  // 默认颜色（如果有额外类型）
    }
  };

  return (
    <View style={styles.container}>
      {/* 用户可以使用选择器选择自行车类型 */}
      <Picker
        selectedValue={selectedType}  // 当前选择的类型
        onValueChange={(itemValue) => setSelectedType(itemValue)}  // 当用户选择类型时更新状态
        style={styles.picker}
      >
        {/* 提供所有类型的选择项 */}
        <Picker.Item label="All" value="all" />
        <Picker.Item label="Electric" value="Electric" />
        <Picker.Item label="Mountain" value="Mountain" />
        <Picker.Item label="Road" value="Road" />
      </Picker>

      {/* 地图视图 */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 41.3486,  // 初始地图的纬度（设置为某个默认位置）
          longitude: -8.7478,  // 初始地图的经度
          latitudeDelta: 0.02,  // 纬度缩放程度（控制地图的缩放）
          longitudeDelta: 0.02,  // 经度缩放程度
        }}
      >
        {/* 根据过滤后的自行车数据渲染地图标记 */}
        {filterBikesByType().map((bike) => {
          return (
            <Marker
              key={bike.id}  // 每个标记的唯一键
              coordinate={{ latitude: bike.latitude, longitude: bike.longitude }}  // 自行车位置的经纬度坐标
              title={`${bike.brand} ${bike.model}`}  // 标记的标题，显示自行车的品牌和型号
              pinColor={getPinColorByType(bike.type)}  // 根据自行车类型设置标记颜色
              onPress={() => {
                navigation.navigate('details', { bikeDetails: bike });  // 点击标记时导航到详情页面，并传递当前自行车的详细信息
              }}
            />
          );
        })}
      </MapView>
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,  // 让容器占据整个屏幕
  },
  map: {
    flex: 1,  // 地图占据屏幕的所有可用空间
  },
  picker: {
    height: 50,  // 选择器的高度
    width: 150,  // 选择器的宽度
    alignSelf: 'flex-end',  // 将选择器放置在屏幕的右上角
    marginRight: 16,  // 右边距
  },
});

export default MapScreen;
