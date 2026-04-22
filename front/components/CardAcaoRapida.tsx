import { icons } from '@/constants/icons'
import clsx from 'clsx'
import { router } from 'expo-router'
import React from 'react'
import { Image, Pressable, Text, View } from 'react-native'

const CardAcaoRapida = ({ title, description, img, color, page }: { title: string, description: string, img: any, color: any, page: string }) => {

  const handlePress = () => {
    router.push(`../${page}`)
  }

  return (
    // fazer um card com a imagem do lado esquerdo, o título e descrição do lado direito e um ícone de seta para direita no final do card, o card deve ser clicável e levar para a página correspondente
    <Pressable onPress={handlePress} className={clsx('sub-card', 'bg-card')} style={color ? { backgroundColor: color } : undefined}>
      <View className='sub-head'>
        <Image source={img} className='w-16 h-16 rounded-2xl mr-3' resizeMode='cover' />
        <View className='sub-main'>
          <View className='sub-copy'>
            <Text numberOfLines={1} className="sub-title">{title}</Text>
            <Text className="sub-description">{description}</Text>
          </View>
        </View>
        <View className='sub-price-box'>
          <Image source={icons.forward} className='w-8 h-6' />
        </View>
      </View>
    </Pressable>
  )
}

export default CardAcaoRapida;