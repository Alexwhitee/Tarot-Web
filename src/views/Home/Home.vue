<template>
  <section class="Home">
    <div class="text">
      <h3>深呼吸，屏除杂念，集中注意力，默念你的问题，开始你的塔罗占卜之旅</h3>
      <Textarea v-model.trim="textValue" placeholder="你要占卜的问题（必须）" :disabled="loadingStatus" />
    </div>

    <template v-if="!loadingStatus">
      <!-- 排阵选择界面 -->
      <div class="spread-selection" v-if="!selectedSpread">
        <h3 class="text nb">选择排阵方式</h3>
        <div class="spread-list">
          <div
            class="spread-card"
            v-for="spread in spreadLayouts"
            :key="spread.id"
            @click="selectSpread(spread)"
          >
            <div class="spread-info">
              <h4>{{ spread.name }}</h4>
              <p class="spread-desc">{{ spread.description }}</p>
              <p class="spread-count">需要选择 {{ spread.cardCount }} 张牌</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 卡牌选择界面 -->
      <div v-else>
        <div class="spread-header">
          <h3 class="text nb">
            {{ selectedSpread.name }} - 从78张塔罗牌中选择 {{ selectedSpread.cardCount }} 张
          </h3>
          <Button variant="outline" size="sm" @click="backToSpreadSelection">重新选择排阵</Button>
        </div>

        <!-- 选择进度指示器 -->
        <div class="selection-progress">
          <div class="progress-info">
            <span class="current">已选择：{{ selectCardArr.length }}</span>
            <span class="divider">/</span>
            <span class="total">需要：{{ selectedSpread.cardCount }}</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: (selectCardArr.length / selectedSpread.cardCount * 100) + '%' }"
            ></div>
          </div>
          <Button
            v-if="selectCardArr.length > 0"
            variant="outline"
            size="sm"
            @click="clearSelection"
            class="clear-btn"
          >
            清空选择
          </Button>
        </div>

        <div class="card-selection-grid">
          <div
            class="card-item"
            :class="{
              selected: selectCardArr.includes(i),
              'selection-complete': selectCardArr.length >= selectedSpread.cardCount && !selectCardArr.includes(i)
            }"
            v-for="i in 78"
            :key="i"
            @click="toggleCard(i)"
          >
            <img :src="renderIMG('bg.jpg')" alt="塔罗牌背面" />
            <div v-if="selectCardArr.includes(i)" class="selection-number">
              {{ selectCardArr.indexOf(i) + 1 }}
            </div>
          </div>
        </div>

        <div class="btn">
          <Button
            class="mt-4 w-full"
            :disabled="selectCardArr.length !== selectedSpread.cardCount || !textValue"
            @click="getRes"
          >
            开始占卜
          </Button>
        </div>
      </div>
    </template>

    <div class="card-jx" v-else>
      <div class="result-header">
        <h3>{{ selectedSpread?.name }} 占卜结果</h3>
      </div>

      <div class="show-card" :class="[`layout-${selectedSpread?.id}`]">
        <div
          class="card-position"
          v-for="(card, index) in selectCardArr"
          :key="index"
        >
          <img
            :class="{ rever: card.isReversed }"
            :src="renderIMG(`${card.no}.jpg`)"
          />
          <div class="position-label">{{ selectedSpread?.positions[index] }}</div>
        </div>
      </div>

      <Alert class="mt-4" v-if="resStatus">
        <AlertTitle>塔罗牌解析：</AlertTitle>
        <AlertDescription><p class="[&>p]:indent-8 [&>p]:pt-2" ref="typedText"></p></AlertDescription>
      </Alert>

      <Button class="mt-4 ml-auto block w-max" @click="resetFn">重新开始</Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import vh from 'vh-plugin'
import { marked } from 'marked'
import Typed from 'typed.js'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// 排阵配置
const spreadLayouts = ref([
  {
    id: 'single',
    name: '单张牌占卜',
    description: '简单直接的指引',
    cardCount: 1,
    positions: ['当前指引'],
    icon: '🎯'
  },
  {
    id: 'three-card',
    name: '三张牌占卜',
    description: '过去、现在、未来',
    cardCount: 3,
    positions: ['过去', '现在', '未来'],
    icon: '⏳'
  },
  {
    id: 'five-card',
    name: '五张牌占卜',
    description: '全面分析当前情况',
    cardCount: 5,
    positions: ['当前情况', '面临障碍', '过去影响', '未来趋势', '最终结果'],
    icon: '🌟'
  },
  {
    id: 'celtic-cross',
    name: '凯尔特十字',
    description: '最全面的占卜排阵',
    cardCount: 10,
    positions: ['现状', '挑战', '远因', '近因', '可能结果', '近期', '你的态度', '外界影响', '内心期望', '最终结果'],
    icon: '✨'
  }
])

// 选中的排阵
const selectedSpread = ref<any>(null)

// 选择排阵
const selectSpread = (spread: any) => {
  selectedSpread.value = spread
  selectCardArr.value = []
}

// 返回排阵选择
const backToSpreadSelection = () => {
  selectedSpread.value = null
  selectCardArr.value = []
}

// 选择卡牌数组
const selectCardArr = ref<Array<number>>([])

// 切换卡牌选择状态
const toggleCard = (cardIndex: number) => {
  const currentIndex = selectCardArr.value.indexOf(cardIndex)

  if (currentIndex > -1) {
    // 如果已选中，则取消选择
    selectCardArr.value.splice(currentIndex, 1)
  } else {
    // 如果未选中且未达到上限，则添加选择
    if (selectCardArr.value.length < selectedSpread.value.cardCount) {
      selectCardArr.value.push(cardIndex)
    }
  }
}

// 清空选择
const clearSelection = () => {
  selectCardArr.value = []
}

// 获取解析
const textValue = ref<string>('')
const loadingStatus = ref<boolean>(false)
const resStatus = ref<boolean>(false)
const getRes = async () => {
  loadingStatus.value = true
  selectCardArr.value = selectCardArr.value.map((i) => ({ no: i, isReversed: Math.random() > 0.5 }))
  vh.showLoading()

  const requestData = {
    text: textValue.value,
    pms: selectCardArr.value,
    spread: selectedSpread.value
  }

  const res = await fetch('/api', {
    method: 'POST',
    body: JSON.stringify(requestData)
  })
  vh.hideLoading()
  resStatus.value = true
  const resText = await res.text()
  renderRES(resText)
}

// 渲染后的 HTML 内容
const typedText = ref<HTMLParagraphElement>()
let typedInstance: Typed | null = null

const renderRES = async (md: string) => {
  const renderedMarkdown = await marked.parse(md)

  // 销毁之前的实例（如果存在）
  if (typedInstance) {
    typedInstance.destroy()
  }

  // 创建新的 Typed 实例
  typedInstance = new Typed(typedText.value!, {
    strings: [renderedMarkdown as string],
    typeSpeed: 16,
    showCursor: false,
    contentType: 'html'
  })
}

// 重置
const resetFn = async () => {
  vh.showLoading()
  await new Promise((resolve) => setTimeout(resolve, 666))
  selectCardArr.value = []
  textValue.value = ''
  selectedSpread.value = null
  resStatus.value = false
  loadingStatus.value = false

  // 销毁 Typed 实例
  if (typedInstance) {
    typedInstance.destroy()
    typedInstance = null
  }

  vh.hideLoading()
}

// 动态渲染卡牌
const renderIMG = (url: string) => new URL(`../../assets/images/card/${url}`, import.meta.url).href
</script>

<style scoped lang="less">
@import 'Home.less';
</style>
