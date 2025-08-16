<!--<template>-->
<!--  <section class="Home">-->
<!--    <div class="text">-->
<!--      <h3 class="section-title">1.深呼吸，屏除杂念，集中注意力，写下并默念你的问题，开始你的塔罗占卜之旅</h3>-->
<!--      <Textarea-->
<!--        v-model.trim="textValue"-->
<!--        placeholder="你要占卜的问题（可选）"-->
<!--        :disabled="loadingStatus"-->
<!--      />-->
<!--    </div>-->

<!--    <template v-if="!loadingStatus">-->
<!--      <div class="deck-selection mb-4">-->
<!--        <h3 class="section-title">2.选择塔罗牌种类（必须）</h3>-->
<!--        <div class="deck-list flex gap-4">-->
<!--          <div-->
<!--            v-for="d in decks"-->
<!--            :key="d.key"-->
<!--            class="deck-card p-2 border rounded cursor-pointer"-->
<!--            :class="{ active: selectedDeckKey === d.key }"-->
<!--            @click="selectDeck(d.key)"-->
<!--          >-->
<!--            {{ d.name }}-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class="mt-2">-->
<!--        <label>-->
<!--          <input type="checkbox" v-model="needReversed" /> 是否带逆位-->
<!--        </label>-->
<!--      </div>-->

<!--      <div class="spread-selection" v-if="selectedDeckKey">-->
<!--        <h3 class="section-title">3.选择牌阵（必须）</h3>-->
<!--        <div class="spread-list flex flex-wrap gap-4">-->
<!--          <div-->
<!--            v-for="s in spreads"-->
<!--            :key="s.key"-->
<!--            class="spread-card p-2 border rounded cursor-pointer"-->
<!--            :class="{ active: selectedSpreadKey === s.key }"-->
<!--            @click="() => { selectedSpreadKey = s.key; clickedSpread = s; }"-->
<!--          >-->
<!--            <div class="spread-header font-bold">-->
<!--              <span class="spread-name">{{ s.name }}</span>-->
<!--              <span class="spread-count">（{{ s.count }}张）</span>-->
<!--            </div>-->
<!--            <p class="spread-desc text-sm">{{ s.desc }}</p>-->
<!--          </div>-->
<!--        </div>-->
<!--        <Button class="mt-4 w-full" :disabled="!selectedSpreadKey || isSpreadConfirmed" @click="confirmSpread">-->
<!--          确认牌阵-->
<!--        </Button>-->
<!--      </div>-->

<!--      <div class="hover-info-wrapper mt-4" v-if="clickedSpread">-->
<!--        <div class="spread-info-bar">-->
<!--          <p><strong>{{ clickedSpread?.name }}（{{ clickedSpread?.count }}张）</strong></p>-->
<!--          <p>{{ clickedSpread?.desc }}</p>-->
<!--          <p>适用场景：{{ clickedSpread?.usage }}</p>-->
<!--          <p>-->
<!--            <strong>牌位含义：</strong>-->
<!--            <span v-for="(pos, index) in clickedSpread?.positions ?? []" :key="index">-->
<!--              （{{ index + 1 }}）{{ pos }}-->
<!--              <span v-if="index < (clickedSpread?.positions?.length ?? 0) - 1"></span>-->
<!--            </span>-->
<!--          </p>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class="selected-spread-info mt-4" v-if="isSpreadConfirmed">-->
<!--        当前牌阵：{{ selectedSpread?.name }}（需 {{ selectedCardCount }} 张） | 已选：{{ selectCardArr.length }} 张-->
<!--      </div>-->

<!--      <div class="card-strip-wrapper" v-if="isSpreadConfirmed && !resStatus">-->
<!--        <div-->
<!--          class="card-strip"-->
<!--          ref="cardStripWrapper"-->
<!--          @mousedown="onDragStart"-->
<!--          @touchstart.passive="onDragStart"-->
<!--        >-->
<!--          <div-->
<!--            class="card"-->
<!--            v-for="(i, index) in shuffledDeck"-->
<!--            :key="i.no"-->
<!--            :class="{ active: selectCardArr.includes(i.no) }"-->
<!--            @click="selectCard(i.no)"-->
<!--            :style="{-->
<!--              transform: `translateX(${(index * cardPartialWidth) - viewOffset}px) ${selectCardArr.includes(i.no) ? 'translateY(-40px)' : ''}`,-->
<!--              width: cardWidth + 'px',-->
<!--              zIndex: selectCardArr.includes(i.no) ? 100 : index-->
<!--            }"-->
<!--          >-->
<!--            <img :src="renderBackImage()" class="card-back" />-->
<!--          </div>-->
<!--        </div>-->
<!--        <input-->
<!--          v-show="sliderMax > 0"-->
<!--          class="card-strip-slider"-->
<!--          style="width: 100%; margin-top: 10px;"-->
<!--          type="range"-->
<!--          min="0"-->
<!--          :max="sliderMax"-->
<!--          v-model.number="viewOffset"-->
<!--        />-->
<!--      </div>-->
<!--      <div class="btn mt-4">-->
<!--        <Button class="mt-4 w-full button-spacing" :disabled="selectCardArr.length !== selectedCardCount" @click="getRes">-->
<!--          开始占卜-->
<!--        </Button>-->
<!--      </div>-->
<!--    </template>-->

<!--    <div class="card-jx mt-4" v-else>-->
<!--      <div class="show-card flex flex-wrap gap-4">-->
<!--        <div class="card-item" v-for="(i, index) in cardResult" :key="i.no">-->
<!--          <img :class="{ rever: i.isReversed }" :src="renderIMG(i.no)" />-->
<!--          <div class="card-label">-->
<!--            （{{ index + 1 }}）{{ selectedSpread?.positions?.[index] ?? `第${index + 1}张` }}-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <Alert class="mt-4" v-if="resStatus">-->
<!--        <AlertTitle>塔罗牌解析：</AlertTitle>-->
<!--        <AlertDescription>-->
<!--          <p class="[&>p]:indent-8 [&>p]:pt-2" ref="typedText"></p>-->
<!--        </AlertDescription>-->
<!--      </Alert>-->
<!--      <Button class="mt-4 ml-auto block w-max" @click="resetFn">重新开始</Button>-->
<!--    </div>-->
<!--  </section>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'-->
<!--import vh from 'vh-plugin'-->
<!--import { marked } from 'marked'-->
<!--import Typed from 'typed.js'-->
<!--import { Button } from '@/components/ui/button'-->
<!--import { Textarea } from '@/components/ui/textarea'-->
<!--import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'-->
<!--// 导入你的数据配置文件-->
<!--import tarotDecks from '../../data/tarot-decks.json';-->
<!--type Spread = {-->
<!--  key: string-->
<!--  name: string-->
<!--  count: number-->
<!--  positions?: string[]-->
<!--  desc?: string-->
<!--  usage?: string-->
<!--}-->
<!--type Deck = {-->
<!--  key: string-->
<!--  name: string-->
<!--  cardCount: number-->
<!--  imagePath: string-->
<!--  start?: number-->
<!--  spreads: Spread[]-->
<!--}-->
<!--type CardResult = {-->
<!--  no: number-->
<!--  isReversed: boolean-->
<!--}-->

<!--const typedText = ref<HTMLParagraphElement | null>(null)-->
<!--let typedInstance: Typed | null = null-->
<!--// 原：const renderRES = (md: string) => { ... }-->
<!--// 改成 ↓↓↓-->
<!--const renderRES = (html: string) => {-->
<!--  if (!typedText.value) return;-->

<!--  if (typedInstance) {-->
<!--    typedInstance.destroy();-->
<!--    typedInstance = null;-->
<!--  }-->

<!--  typedInstance = new Typed(typedText.value, {-->
<!--    strings: [html],-->
<!--    typeSpeed: 16,-->
<!--    showCursor: false,-->
<!--    contentType: 'html',-->
<!--  });-->
<!--};-->

<!--// 把可能是 string 或 Promise<string> 的结果，统一变成 string-->
<!--const parseMdToHtml = async (md: string): Promise<string> => {-->
<!--  const maybe = marked.parse(md);          // 类型：string | Promise<string>-->
<!--  return typeof maybe === 'string' ? maybe : await maybe; // 统一成 string-->
<!--};-->

<!--// 修改 decks 的定义，直接使用导入的数据-->
<!--const decks = ref<Deck[]>(tarotDecks as Deck[]); // 使用导入的数据并进行类型断言-->
<!--const selectedDeckKey = ref('')-->
<!--const selectedDeck = computed(() => decks.value.find(d => d.key === selectedDeckKey.value))-->
<!--const spreads = computed(() => selectedDeck.value?.spreads ?? [])-->
<!--const selectedSpreadKey = ref<Spread['key']>('')-->
<!--const isSpreadConfirmed = ref(false)-->
<!--const clickedSpread = ref<Spread | null>(null)-->
<!--const needReversed = ref(true)-->
<!--const selectedSpread = computed(() => spreads.value.find(s => s.key === selectedSpreadKey.value))-->
<!--const selectedCardCount = computed(() => isSpreadConfirmed.value ? (selectedSpread.value?.count ?? 0) : 0)-->
<!--const selectCardArr = ref<number[]>([])-->
<!--watch(selectedSpreadKey, () => { selectCardArr.value = [] })-->

<!--const shuffledDeck = ref<CardResult[]>([])-->
<!--const initShuffledDeck = () => {-->
<!--  const deckCount = selectedDeck.value?.cardCount ?? 78-->
<!--  const deck: CardResult[] = Array.from({ length: deckCount }, (_, i) => ({ no: i, isReversed: false }))-->
<!--  for (let i = deck.length - 1; i > 0; i&#45;&#45;) {-->
<!--    const j = Math.floor(Math.random() * (i + 1))-->
<!--    ;[deck[i], deck[j]] = [deck[j], deck[i]]-->
<!--  }-->
<!--  shuffledDeck.value = deck-->
<!--}-->

<!--const cardStripWrapper = ref<HTMLDivElement | null>(null)-->
<!--const cardWidth = 88-->
<!--let isDragging = false-->
<!--let dragStartX = 0-->

<!--const viewOffset = ref(0)-->
<!--let dragStartOffset = 0-->
<!--const containerWidth = ref(0)-->

<!--const cardPartialWidth = cardWidth * 0.6-->

<!--const totalCardsWidth = computed(() => {-->
<!--  const deck = shuffledDeck.value-->
<!--  if (!deck || deck.length === 0) return 0-->
<!--  return (deck.length - 1) * cardPartialWidth + cardWidth-->
<!--})-->

<!--const sliderMax = computed(() => {-->
<!--  return Math.max(0, totalCardsWidth.value - containerWidth.value)-->
<!--})-->

<!--const onWheelWithShift = (e: WheelEvent) => {-->
<!--  if (e.shiftKey && isSpreadConfirmed.value) {-->
<!--    e.preventDefault();-->
<!--    const newOffset = viewOffset.value + (e.deltaY > 0 ? 50 : -50);-->
<!--    viewOffset.value = Math.max(0, Math.min(newOffset, sliderMax.value));-->
<!--  }-->
<!--};-->

<!--onMounted(() => {-->
<!--  window.addEventListener('wheel', onWheelWithShift, { passive: false });-->

<!--  if (cardStripWrapper.value) {-->
<!--    containerWidth.value = cardStripWrapper.value.clientWidth;-->
<!--  }-->
<!--});-->

<!--onBeforeUnmount(() => {-->
<!--  window.removeEventListener('wheel', onWheelWithShift);-->

<!--  if (typedInstance) {-->
<!--    typedInstance.destroy();-->
<!--    typedInstance = null;-->
<!--  }-->
<!--});-->

<!--const onDragStart = (e: MouseEvent | TouchEvent) => {-->
<!--  const el = cardStripWrapper.value; if (!el) return-->
<!--  isDragging = true-->
<!--  dragStartX = 'touches' in e ? e.touches[0].clientX : e.clientX-->
<!--  dragStartOffset = viewOffset.value-->
<!--  window.addEventListener('mousemove', onDragMove)-->
<!--  window.addEventListener('mouseup', onDragEnd)-->
<!--  window.addEventListener('touchmove', onDragMove as any, { passive: false })-->
<!--  window.addEventListener('touchend', onDragEnd)-->
<!--}-->

<!--const SCALE = 3   // ← 新增：灵敏度系数-->
<!--const onDragMove = (e: MouseEvent | TouchEvent) => {-->
<!--  if (!isDragging) return-->
<!--  if ('preventDefault' in e) e.preventDefault()-->

<!--  const x = 'touches' in e ? e.touches[0].clientX : e.clientX-->
<!--  const dx = x - dragStartX-->
<!--  const newOffset = dragStartOffset - dx * SCALE   // ← 乘以系数-->

<!--  viewOffset.value = Math.max(0, Math.min(newOffset, sliderMax.value));-->
<!--}-->

<!--const onDragEnd = () => {-->
<!--  isDragging = false-->
<!--  window.removeEventListener('mousemove', onDragMove)-->
<!--  window.removeEventListener('mouseup', onDragEnd)-->
<!--  window.removeEventListener('touchmove', onDragMove as any)-->
<!--  window.removeEventListener('touchend', onDragEnd)-->


<!--}-->
<!--const recalcAfterDOMUpdate = async () => { }-->

<!--watch([selectedDeckKey, isSpreadConfirmed, () => shuffledDeck.value.length], recalcAfterDOMUpdate)-->

<!--const textValue = ref('')-->
<!--const loadingStatus = ref(false)-->
<!--const resStatus = ref(false)-->
<!--const cardResult = ref<CardResult[]>([])-->

<!--const selectDeck = (key: string) => {-->
<!--  selectedDeckKey.value = key-->
<!--  selectedSpreadKey.value = ''-->
<!--  clickedSpread.value = null-->
<!--  selectCardArr.value = []-->
<!--  initShuffledDeck()-->
<!--  recalcAfterDOMUpdate()-->
<!--}-->
<!--const selectCard = (id: number) => {-->
<!--  if (selectCardArr.value.includes(id)) { selectCardArr.value = selectCardArr.value.filter(i => i !== id); return }-->
<!--  if (selectCardArr.value.length >= selectedCardCount.value) return-->
<!--  selectCardArr.value.push(id)-->
<!--}-->
<!--const confirmSpread = async () => {-->
<!--  if (!selectedSpreadKey.value) return-->
<!--  isSpreadConfirmed.value = true-->
<!--  selectCardArr.value = []-->

<!--  await nextTick()-->
<!--  if (cardStripWrapper.value) {-->
<!--    containerWidth.value = cardStripWrapper.value.clientWidth-->
<!--  }-->
<!--}-->

<!--// 修正后的 getRes 函数-->
<!--// const getRes = async () => {-->
<!--//   loadingStatus.value = true-->
<!--//   cardResult.value = selectCardArr.value.map(i => ({ no: i, isReversed: needReversed.value ? Math.random() > 0.5 : false }))-->
<!--//   vh.showLoading()-->
<!--//   const res = await fetch('/api', {-->
<!--//     method: 'POST',-->
<!--//     body: JSON.stringify({-->
<!--//       text: textValue.value,-->
<!--//       pms: cardResult.value,-->
<!--//       spread: {-->
<!--//         key: selectedSpread.value?.key ?? '',-->
<!--//         name: selectedSpread.value?.name ?? '',-->
<!--//         count: selectedSpread.value?.count ?? 0,-->
<!--//         positions: selectedSpread.value?.positions ?? []-->
<!--//       },-->
<!--//       deck: {-->
<!--//         key: selectedDeck.value?.key ?? '',-->
<!--//         name: selectedDeck.value?.name ?? ''-->
<!--//       }-->
<!--//     })-->
<!--//   })-->
<!--//   vh.hideLoading()-->
<!--//   resStatus.value = true-->
<!--//   const resText = await res.text()-->
<!--//   await nextTick()-->
<!--//   // 在这里直接将纯字符串传给 renderRES，避免类型错误-->
<!--//   renderRES(resText)-->
<!--// }-->
<!--const resetFn = () => {-->
<!--  selectCardArr.value = []-->
<!--  cardResult.value = []-->
<!--  resStatus.value = false-->
<!--  loadingStatus.value = false-->
<!--  isSpreadConfirmed.value = false-->
<!--  clickedSpread.value = null-->
<!--  needReversed.value = true-->
<!--  selectedDeckKey.value = ''-->
<!--  selectedSpreadKey.value = ''-->
<!--  initShuffledDeck()-->
<!--  textValue.value = ''-->
<!--  if (typedInstance) { typedInstance.destroy(); typedInstance = null }-->
<!--}-->

<!--// const renderBackImage = () => {-->
<!--//   const path = selectedDeck.value?.imagePath ?? '../../assets/images/card/'-->
<!--//   return new URL(`${path}back.jpg`, import.meta.url).href-->
<!--// }-->
<!--//-->
<!--// // const renderIMG = (no: number) => {-->
<!--// //   const path = selectedDeck.value?.imagePath ?? '../../assets/images/card/'-->
<!--// //   return new URL(`${path}${no}.jpg`, import.meta.url).href-->
<!--// // }-->
<!--//-->
<!--//-->
<!--// // ... (之前的代码保持不变)-->
<!--//-->
<!--// // 修正后的 renderIMG 函数，它返回一个同步的字符串-->
<!--// const renderIMG = (no: number): string => {-->
<!--//   const path = selectedDeck.value?.imagePath ?? '../../assets/images/card/'-->
<!--//   // 使用 Vite 推荐的 new URL 方式-->
<!--//   return new URL(`${path}${no}.jpg`, import.meta.url).href-->
<!--// }-->
<!--const base = import.meta.env.BASE_URL // 一般是 '/'-->

<!--const renderBackImage = () => {-->
<!--  const path = selectedDeck.value?.imagePath ?? 'cards/card/'-->

<!--  return `${base}${path}back.jpg`-->
<!--}-->

<!--// const renderIMG = (no: number): string => {-->
<!--//   const path = selectedDeck.value?.imagePath ?? 'cards/card/'-->
<!--//   return `${base}${path}${no}.jpg`-->
<!--// }-->
<!--const renderIMG = (no: number): string => {-->
<!--  const path = selectedDeck.value?.imagePath ?? 'cards/card/'-->
<!--  const start = selectedDeck.value?.start ?? 0   // 默认为 0-->
<!--  const fileNo = no + start-->
<!--  return `${base}${path}${fileNo}.jpg`-->
<!--}-->

<!--const getRes = async () => {-->
<!--  loadingStatus.value = true;-->
<!--  cardResult.value = selectCardArr.value.map(i => ({ no: i, isReversed: needReversed.value ? Math.random() > 0.5 : false }));-->
<!--  vh.showLoading();-->

<!--  try {-->
<!--    const res = await fetch('/api', {-->
<!--      method: 'POST',-->
<!--      body: JSON.stringify({-->
<!--        text: textValue.value,-->
<!--        pms: cardResult.value,-->
<!--        spread: {-->
<!--          key: selectedSpread.value?.key ?? '',-->
<!--          name: selectedSpread.value?.name ?? '',-->
<!--          count: selectedSpread.value?.count ?? 0,-->
<!--          positions: selectedSpread.value?.positions ?? []-->
<!--        },-->
<!--        deck: {-->
<!--          key: selectedDeck.value?.key ?? '',-->
<!--          name: selectedDeck.value?.name ?? ''-->
<!--        }-->
<!--      })-->
<!--    });-->

<!--    // 确保 fetch 请求成功-->
<!--    if (!res.ok) {-->
<!--      throw new Error(`API response was not ok: ${res.statusText}`);-->
<!--    }-->

<!--    const resText = await res.text();-->

<!--// ❗不要再直接 await marked.parse(...) 了，让工具函数来“消联合”-->
<!--    const html = await parseMdToHtml(resText);-->

<!--    resStatus.value = true;-->
<!--    await nextTick();-->
<!--    renderRES(html); // 这里的 html 现在是 string，类型完全匹配-->




<!--  } catch (error) {-->
<!--    console.error('占卜请求失败:', error);-->
<!--    // 处理错误，例如显示错误信息给用户-->
<!--  } finally {-->
<!--    vh.hideLoading();-->
<!--  }-->
<!--};-->
<!--onMounted(() => {-->
<!--  if (cardStripWrapper.value) {-->
<!--    containerWidth.value = cardStripWrapper.value.clientWidth-->
<!--  }-->
<!--})-->

<!--onBeforeUnmount(() => { if (typedInstance) { typedInstance.destroy(); typedInstance = null } })-->
<!--</script>-->

<!--<style scoped lang="less">-->
<!--@import 'Home.less';-->

<!--.hover-info-wrapper {-->
<!--  height: 140px;-->
<!--  margin-bottom: 12px;-->
<!--}-->

<!--.spread-info-bar {-->
<!--  position: relative;-->
<!--  background: #fff8f0;-->
<!--  padding: 6px;-->
<!--  border-radius: 4px;-->
<!--}-->

<!--.spread-selection {-->
<!--  margin-bottom: 24px;-->
<!--  .spread-list {-->
<!--    display: flex;-->
<!--    flex-wrap: wrap;-->
<!--    gap: 12px;-->
<!--  }-->
<!--}-->

<!--.spread-card {-->
<!--  background: #fdf6f0;-->
<!--  border: 1px solid #ccc;-->
<!--  border-radius: 8px;-->
<!--  padding: 12px;-->
<!--  width: 200px;-->
<!--  cursor: pointer;-->
<!--  transition: all 0.2s;-->

<!--  .spread-header {-->
<!--    font-weight: bold;-->
<!--    margin-bottom: 6px;-->
<!--  }-->

<!--  &:hover {-->
<!--    transform: translateY(-4px);-->
<!--    box-shadow: 0 4px 12px rgba(0,0,0,0.15);-->
<!--  }-->

<!--  &.active {-->
<!--    border-color: #f39c12;-->
<!--    box-shadow: 0 0 0 3px rgba(243,156,18,0.2);-->
<!--  }-->
<!--}-->

<!--.selected-spread-info {-->
<!--  margin-top: 12px;-->
<!--  font-size: 14px;-->
<!--  color: #444;-->
<!--}-->

<!--.card-strip-wrapper {-->
<!--  position: relative;-->
<!--  width: 100%;-->
<!--  overflow-x: visible;-->
<!--  height: 200px;-->
<!--  margin-top: 12px;-->
<!--}-->

<!--.card-strip {-->
<!--  position: relative;-->
<!--  height: 100%;-->
<!--  cursor: grab;-->
<!--}-->

<!--.card {-->
<!--  position: absolute;-->
<!--  bottom: 0;-->
<!--  width: 88px;-->
<!--  transition: transform 0.2s, z-index 0.2s;-->
<!--}-->

<!--.card.active {-->
<!--  border: 2px solid gold;-->
<!--  box-shadow: 0 0 10px rgba(255,215,0,0.6);-->
<!--  z-index: 100;-->
<!--}-->

<!--.card img.card-back {-->
<!--  width: 100%;-->
<!--  height: auto;-->
<!--  border-radius: 4px;-->
<!--  box-shadow: 0 2px 6px rgba(0,0,0,0.3);-->
<!--}-->

<!--.show-card {-->
<!--  display: flex;-->
<!--  flex-wrap: wrap;-->
<!--  gap: 12px;-->
<!--  justify-content: center;-->
<!--}-->

<!--.card-item {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  align-items: center;-->
<!--}-->

<!--.card-item img {-->
<!--  width: 100px;-->
<!--  height: auto;-->
<!--}-->

<!--.card-label {-->
<!--  margin-top: 4px;-->
<!--  font-size: 14px;-->
<!--  color: #666;-->
<!--}-->

<!--@media (max-width: 768px) {-->
<!--  .spread-list {-->
<!--    flex-direction: column;-->
<!--  }-->
<!--  .spread-card {-->
<!--    width: 100%;-->
<!--  }-->
<!--  .card-item img {-->
<!--    width: min(22vw, 90px);-->
<!--  }-->
<!--  .card-label {-->
<!--    font-size: 12px;-->
<!--  }-->
<!--}-->

<!--.card-strip-slider {-->
<!--  -webkit-appearance: none;-->
<!--  appearance: none;-->
<!--  width: 100%;-->
<!--  height: 8px;-->
<!--  background: #ddd;-->
<!--  border-radius: 5px;-->
<!--  outline: none;-->
<!--  opacity: 0.7;-->
<!--  transition: opacity .2s;-->
<!--  margin-top: 15px;-->
<!--}-->

<!--.card-strip-slider:hover {-->
<!--  opacity: 1;-->
<!--}-->

<!--.card-strip-slider::-webkit-slider-thumb {-->
<!--  -webkit-appearance: none;-->
<!--  appearance: none;-->
<!--  width: 18px;-->
<!--  height: 18px;-->
<!--  background: #f39c12;-->
<!--  cursor: pointer;-->
<!--  border-radius: 50%;-->
<!--}-->

<!--.card-strip-slider::-moz-range-thumb {-->
<!--  width: 18px;-->
<!--  height: 18px;-->
<!--  background: #f39c12;-->
<!--  cursor: pointer;-->
<!--  border-radius: 50%;-->
<!--}-->

<!--.section-title {-->
<!--  font-size: 1.25rem;-->
<!--  font-weight: bold;-->
<!--  color: #8b4513;-->
<!--  border-bottom: 2px solid #deb887;-->
<!--  padding-bottom: 8px;-->
<!--  margin-bottom: 1rem;-->
<!--  text-transform: uppercase;-->
<!--}-->
<!--.button-spacing {-->
<!--  margin-top: 40px; /* 增加上外边距，向下平移 */-->
<!--}-->
<!--</style>-->
<template>
  <section class="Home">
    <div class="text">
      <h3 class="section-title">1.深呼吸，屏除杂念，集中注意力，写下并默念你的问题，开始你的塔罗占卜之旅</h3>
      <Textarea
        v-model.trim="textValue"
        placeholder="你要占卜的问题（可选）"
        :disabled="loadingStatus"
      />
    </div>

    <template v-if="!loadingStatus">
      <div class="deck-selection mb-4">
        <h3 class="section-title">2.选择塔罗牌种类（必须）</h3>
        <div class="deck-list flex gap-4">
          <div
            v-for="d in decks"
            :key="d.key"
            class="deck-card p-2 border rounded cursor-pointer"
            :class="{ active: selectedDeckKey === d.key }"
            @click="selectDeck(d.key)"
          >
            {{ d.name }}
          </div>
        </div>
      </div>

      <div class="mt-2">
        <label>
          <input type="checkbox" v-model="needReversed" /> 是否带逆位
        </label>
      </div>

      <div class="spread-selection" v-if="selectedDeckKey">
        <h3 class="section-title">3.选择牌阵（必须）</h3>
        <div class="spread-list flex flex-wrap gap-4">
          <div
            v-for="s in spreads"
            :key="s.key"
            class="spread-card p-2 border rounded cursor-pointer"
            :class="{ active: selectedSpreadKey === s.key }"
            @click="() => { selectedSpreadKey = s.key; clickedSpread = s; }"
          >
            <div class="spread-header font-bold">
              <span class="spread-name">{{ s.name }}</span>
              <span class="spread-count">（{{ s.count }}张）</span>
            </div>
            <p class="spread-desc text-sm">{{ s.desc }}</p>
          </div>
        </div>
        <Button class="mt-4 w-full" :disabled="!selectedSpreadKey || isSpreadConfirmed" @click="confirmSpread">
          确认牌阵
        </Button>
      </div>

      <div class="hover-info-wrapper mt-4" v-if="clickedSpread">
        <div class="spread-info-bar">
          <p><strong>{{ clickedSpread?.name }}（{{ clickedSpread?.count }}张）</strong></p>
          <p>{{ clickedSpread?.desc }}</p>
          <p>适用场景：{{ clickedSpread?.usage }}</p>
          <p>
            <strong>牌位含义：</strong>
            <span v-for="(pos, index) in clickedSpread?.positions ?? []" :key="index">
              （{{ index + 1 }}）{{ pos }}
              <span v-if="index < (clickedSpread?.positions?.length ?? 0) - 1"></span>
            </span>
          </p>
        </div>
      </div>

      <div class="selected-spread-info mt-4" v-if="isSpreadConfirmed">
        当前牌阵：{{ selectedSpread?.name }}（需 {{ selectedCardCount }} 张） | 已选：{{ selectCardArr.length }} 张
      </div>

      <div class="card-strip-wrapper" v-if="isSpreadConfirmed && !resStatus">
        <div
          class="card-strip"
          ref="cardStripWrapper"
          @mousedown="onDragStart"
          @touchstart.passive="onDragStart"
        >
          <div
            class="card"
            v-for="(i, index) in shuffledDeck"
            :key="i.no"
            :class="{ active: selectCardArr.includes(i.no) }"
            @click="selectCard(i.no)"
            :style="cardStyle(index, i.no)"
            :data-index="index"
          >
            <!-- 内层元素用于局部动画（不覆盖外层 translateX） -->
            <div class="card-inner" :ref="el => setCardInnerEl(el, index)">
              <img :src="renderBackImage()" class="card-back" />
            </div>
          </div>
        </div>
        <input
          v-show="sliderMax > 0"
          class="card-strip-slider"
          style="width: 100%; margin-top: 10px;"
          type="range"
          min="0"
          :max="sliderMax"
          v-model.number="viewOffset"
        />
      </div>
      <div class="btn mt-4">
        <Button class="mt-4 w-full button-spacing" :disabled="selectCardArr.length !== selectedCardCount" @click="getRes">
          开始占卜
        </Button>
      </div>
    </template>

    <div class="card-jx mt-4" v-else>
      <div class="show-card flex flex-wrap gap-4">
        <div class="card-item" v-for="(i, index) in cardResult" :key="i.no">
          <img :class="{ rever: i.isReversed }" :src="renderIMG(i.no)" />
          <div class="card-label">
            （{{ index + 1 }}）{{ selectedSpread?.positions?.[index] ?? `第${index + 1}张` }}
          </div>
        </div>
      </div>
      <Alert class="mt-4" v-if="resStatus">
        <AlertTitle>塔罗牌解析：</AlertTitle>
        <AlertDescription>
          <p class="[&>p]:indent-8 [&>p]:pt-2" ref="typedText"></p>
        </AlertDescription>
      </Alert>
      <Button class="mt-4 ml-auto block w-max" @click="resetFn">重新开始</Button>
    </div>
  </section>
</template>

<script setup lang="ts">
/* 主要改动点在本脚本内：
   - 引入 gsap、toast 并实现惯性滑动/动画/视觉增强
   - 保持你的原有变量/函数名称与逻辑（selectDeck/selectCard/confirmSpread/getRes/resetFn 等）
*/

import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import vh from 'vh-plugin'
import { marked } from 'marked'
import Typed from 'typed.js'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
// 导入你的数据配置文件
import tarotDecks from '../../data/tarot-decks.json';

// 新增依赖
import gsap from 'gsap'
import { useToast } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

type Spread = {
  key: string
  name: string
  count: number
  positions?: string[]
  desc?: string
  usage?: string
}
type Deck = {
  key: string
  name: string
  cardCount: number
  imagePath: string
  start?: number
  spreads: Spread[]
}
type CardResult = {
  no: number
  isReversed: boolean
}

/* ---------- 保留并强化原有 typed.js 逻辑 ---------- */
const typedText = ref<HTMLParagraphElement | null>(null)
let typedInstance: Typed | null = null
const renderRES = (html: string) => {
  if (!typedText.value) return;

  if (typedInstance) {
    typedInstance.destroy();
    typedInstance = null;
  }

  typedInstance = new Typed(typedText.value, {
    strings: [html],
    typeSpeed: 16,
    showCursor: false,
    contentType: 'html',
  });
};

const parseMdToHtml = async (md: string): Promise<string> => {
  const maybe = marked.parse(md);
  return typeof maybe === 'string' ? maybe : await maybe;
};

/* ---------- 保留原有状态/计算属性 ---------- */
const decks = ref<Deck[]>(tarotDecks as Deck[]);
const selectedDeckKey = ref('')
const selectedDeck = computed(() => decks.value.find(d => d.key === selectedDeckKey.value))
const spreads = computed(() => selectedDeck.value?.spreads ?? [])
const selectedSpreadKey = ref<Spread['key']>('')
const isSpreadConfirmed = ref(false)
const clickedSpread = ref<Spread | null>(null)
const needReversed = ref(true)
const selectedSpread = computed(() => spreads.value.find(s => s.key === selectedSpreadKey.value))
const selectedCardCount = computed(() => isSpreadConfirmed.value ? (selectedSpread.value?.count ?? 0) : 0)
const selectCardArr = ref<number[]>([])
watch(selectedSpreadKey, () => { selectCardArr.value = [] })

/* ---------- 洗牌数据 & 视觉增强数据 ---------- */
const shuffledDeck = ref<CardResult[]>([])
const cardAngles = ref<Record<number, number>>({})           // 每张牌一个小角度，增添真实感
const cardInnerEls = ref<(HTMLElement | null)[]>([])         // 存储每张牌内层 DOM 引用（用于动画）
const setCardInnerEl = (el: HTMLElement | null, idx: number) => { cardInnerEls.value[idx] = el }

/* 初始化洗牌（并生成随机角度）——保留你原有的随机打乱逻辑 */
const initShuffledDeck = () => {
  const deckCount = selectedDeck.value?.cardCount ?? 78
  const deck: CardResult[] = Array.from({ length: deckCount }, (_, i) => ({ no: i, isReversed: false }))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  shuffledDeck.value = deck

  // 随机角度 [-8deg, 8deg]
  const angles: Record<number, number> = {}
  deck.forEach((c) => {
    angles[c.no] = (Math.random() - 0.5) * 16
  })
  cardAngles.value = angles

  // reset card inner refs
  cardInnerEls.value = []
}

/* ---------- 布局与滑动相关（保留原名） ---------- */
const cardStripWrapper = ref<HTMLDivElement | null>(null)
const cardWidth = 88
let isDragging = false
let dragStartX = 0

const viewOffset = ref(0)
let dragStartOffset = 0
const containerWidth = ref(0)

const cardPartialWidth = cardWidth * 0.6

const totalCardsWidth = computed(() => {
  const deck = shuffledDeck.value
  if (!deck || deck.length === 0) return 0
  return (deck.length - 1) * cardPartialWidth + cardWidth
})

const sliderMax = computed(() => {
  return Math.max(0, totalCardsWidth.value - containerWidth.value)
})

/* ---------- 添加：惯性滑动与速度采样 (用于 onDragEnd) ---------- */
const dragHistory = ref<{ x: number; t: number }[]>([])
let inertiaTween: gsap.core.Tween | null = null
const toast = useToast()

const clamp = (v: number, a = 0, b = 0) => Math.max(a, Math.min(v, b))

/* 通过 card index / no 生成 style（保持原有 translateX 逻辑，并加上随机 rotate 与选中 translateY） */
const cardStyle = (index: number, no: number) => {
  const translateX = (index * cardPartialWidth) - viewOffset.value
  const angle = (cardAngles.value?.[no] ?? 0)
  const isActive = selectCardArr.value.includes(no)
  // 保留原来的 translateY(-40px) 视觉效果，但把它放到外层 transform 中，内部动画只做细节
  const translateY = isActive ? -40 : 0
  return {
    transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${angle}deg)`,
    width: cardWidth + 'px',
    zIndex: isActive ? 100 : index
  }
}

/* 原有 shift+wheel 支持，但改为平滑动画过渡 */
const onWheelWithShift = (e: WheelEvent) => {
  if (e.shiftKey && isSpreadConfirmed.value) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 50 : -50;
    const newOffset = clamp(viewOffset.value + delta, 0, sliderMax.value)
    // 用 gsap 做平滑过渡
    if (inertiaTween) inertiaTween.kill()
    const animObj = { v: viewOffset.value }
    inertiaTween = gsap.to(animObj, {
      v: newOffset,
      duration: 0.45,
      ease: 'power2.out',
      onUpdate: () => { viewOffset.value = clamp(animObj.v, 0, sliderMax.value) },
      onComplete: () => { inertiaTween = null }
    })
  }
};

/* ---------- 拖拽事件：记录速度样本并在结束时做惯性动画 ---------- */
const onDragStart = (e: MouseEvent | TouchEvent) => {
  const el = cardStripWrapper.value; if (!el) return
  // stop any running inertia animation
  if (inertiaTween) { inertiaTween.kill(); inertiaTween = null }
  isDragging = true
  dragStartX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
  dragStartOffset = viewOffset.value

  // reset history and push initial sample
  dragHistory.value = [{ x: dragStartX, t: performance.now() }]

  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
  window.addEventListener('touchmove', onDragMove as any, { passive: false })
  window.addEventListener('touchend', onDragEnd)
}

const SCALE = 3   // 灵敏度系数，保留你的设计
const onDragMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging) return
  if ('preventDefault' in e) e.preventDefault()

  const x = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
  const dx = x - dragStartX
  const newOffset = dragStartOffset - dx * SCALE

  viewOffset.value = clamp(newOffset, 0, sliderMax.value)

  // push sample (保持样本长度短，便于快速估算速度)
  const now = performance.now()
  const hist = dragHistory.value
  hist.push({ x, t: now })
  if (hist.length > 6) hist.shift()
}

const onDragEnd = () => {
  if (!isDragging) return
  isDragging = false

  // 计算速度（采用最后几个样本的线性拟合/差分）
  const hist = dragHistory.value
  if (hist.length >= 2) {
    const last = hist[hist.length - 1]
    // 找 2-4 个样本用于估算速度
    const first = hist[Math.max(0, hist.length - 4)]
    const dx = last.x - first.x
    const dt = (last.t - first.t) || 1
    const velocityPxPerMs = dx / dt // px per ms
    // 计算目标 offset（velocity 越大惯性越明显；系数可调）
    const velocityFactor = velocityPxPerMs * 600  // 经验系数
    let target = clamp(viewOffset.value - velocityFactor, 0, sliderMax.value)

    // 使用 gsap 做减速动画（更平滑）并在边界处弹性
    if (inertiaTween) inertiaTween.kill()
    const animObj = { v: viewOffset.value }
    inertiaTween = gsap.to(animObj, {
      v: target,
      duration: Math.min(1.6, Math.abs(velocityFactor) / 400 + 0.35),
      ease: 'power3.out',
      onUpdate: () => { viewOffset.value = clamp(animObj.v, 0, sliderMax.value) },
      onComplete: () => { inertiaTween = null }
    })
  }

  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('touchmove', onDragMove as any)
  window.removeEventListener('touchend', onDragEnd)
}

/* ---------- 当选牌或取消选牌时，增加动画反馈（使用内层 el） ---------- */
const animateCardSelect = (cardNo: number, index: number, added: boolean) => {
  const el = cardInnerEls.value[index]
  if (!el) return
  // added: 缩放 + 光晕 + 轻微上移； removed: 还原
  if (added) {
    gsap.killTweensOf(el)
    gsap.fromTo(el, { scale: 1, y: 0 }, {
      y: -8,
      scale: 1.06,
      boxShadow: '0px 8px 30px rgba(255,200,80,0.25)',
      duration: 0.5,
      ease: 'elastic.out(1,0.6)'
    })
  } else {
    gsap.killTweensOf(el)
    gsap.to(el, { y: 0, scale: 1, boxShadow: '0px 2px 6px rgba(0,0,0,0.15)', duration: 0.35, ease: 'power2.out' })
  }
}

/* ---------- 保持原有 init / select / confirm / reset 逻辑，仅在 selectCard 中加入动画与提示 ---------- */
const textValue = ref('')
const loadingStatus = ref(false)
const resStatus = ref(false)
const cardResult = ref<CardResult[]>([])

const selectDeck = (key: string) => {
  selectedDeckKey.value = key
  selectedSpreadKey.value = ''
  clickedSpread.value = null
  selectCardArr.value = []
  initShuffledDeck()
  recalcAfterDOMUpdate()
}
const selectCard = (id: number) => {
  if (selectCardArr.value.includes(id)) {
    // 取消选择
    selectCardArr.value = selectCardArr.value.filter(i => i !== id)
    const idx = shuffledDeck.value.findIndex(x => x.no === id)
    if (idx >= 0) animateCardSelect(id, idx, false)
    return
  }
  if (selectCardArr.value.length >= selectedCardCount.value) {
    // 提示已选满（保留原行为：不再加入）
    toast.warning('已选择足够张数，若要更换请先取消已有选择。')
    return
  }
  selectCardArr.value.push(id)
  const idx = shuffledDeck.value.findIndex(x => x.no === id)
  if (idx >= 0) animateCardSelect(id, idx, true)
}
const confirmSpread = async () => {
  if (!selectedSpreadKey.value) return
  isSpreadConfirmed.value = true
  selectCardArr.value = []

  await nextTick()
  if (cardStripWrapper.value) {
    containerWidth.value = cardStripWrapper.value.clientWidth
  }
}

/* ---------- getRes: 在不破坏原来请求流程的前提下，加入抽牌的翻转/出场动画（并保证 fetch 不被破坏） ---------- */
const animateSelectedFlip = async () => {
  // 把当前已选的卡牌做一次翻转/淡出动画（视觉感更好）
  const targets: HTMLElement[] = []
  for (let i = 0; i < shuffledDeck.value.length; i++) {
    if (selectCardArr.value.includes(shuffledDeck.value[i].no)) {
      const el = cardInnerEls.value[i]
      if (el) targets.push(el)
    }
  }
  if (targets.length === 0) return

  // 并行动画并等待结束
  return new Promise<void>((resolve) => {
    gsap.to(targets, {
      rotateY: 180,
      opacity: 0,
      y: -40,
      scale: 1.02,
      duration: 0.7,
      stagger: 0.06,
      ease: 'power2.inOut',
      onComplete: () => {
        // 在视觉上保留短暂时间再 resolve
        setTimeout(() => resolve(), 120)
      }
    })
  })
}

const resetCardInnerStyles = () => {
  // 还原内层元素样式（用于 resetFn 或初始化后）
  cardInnerEls.value.forEach(el => {
    if (!el) return
    gsap.set(el, { clearProps: 'all' })
  })
}

const getRes = async () => {
  loadingStatus.value = true;
  cardResult.value = selectCardArr.value.map(i => ({ no: i, isReversed: needReversed.value ? Math.random() > 0.5 : false }));
  vh.showLoading();

  try {
    // 发起请求同时触发翻转动画（并行）
    const fetchPromise = fetch('/api', {
      method: 'POST',
      body: JSON.stringify({
        text: textValue.value,
        pms: cardResult.value,
        spread: {
          key: selectedSpread.value?.key ?? '',
          name: selectedSpread.value?.name ?? '',
          count: selectedSpread.value?.count ?? 0,
          positions: selectedSpread.value?.positions ?? []
        },
        deck: {
          key: selectedDeck.value?.key ?? '',
          name: selectedDeck.value?.name ?? ''
        }
      })
    });

    // 播放抽牌翻转动画（等待它完成，以便用户感受）
    await animateSelectedFlip().catch(() => { /* ignore animation error */ })

    // fetch 完成后处理
    const res = await fetchPromise
    if (!res.ok) throw new Error(`API response was not ok: ${res.statusText}`)

    const resText = await res.text()
    const html = await parseMdToHtml(resText)

    // 切换到结果显示（保持你的原有 resStatus 逻辑）
    resStatus.value = true
    await nextTick()
    renderRES(html)

  } catch (error) {
    console.error('占卜请求失败:', error);
    toast.error('占卜请求失败，请稍后重试。')
  } finally {
    vh.hideLoading();
    loadingStatus.value = false;
    // 恢复内层样式（以便再次开始）
    resetCardInnerStyles()
  }
};

/* ---------- resetFn 保持逻辑但增加动画/清理 ---------- */
const resetFn = () => {
  selectCardArr.value = []
  cardResult.value = []
  resStatus.value = false
  loadingStatus.value = false
  isSpreadConfirmed.value = false
  clickedSpread.value = null
  needReversed.value = true
  selectedDeckKey.value = ''
  selectedSpreadKey.value = ''
  initShuffledDeck()
  textValue.value = ''
  if (typedInstance) { typedInstance.destroy(); typedInstance = null }
  // 清理可能残留的动画
  if (inertiaTween) { inertiaTween.kill(); inertiaTween = null }
  resetCardInnerStyles()
}

/* ---------- renderBackImage / renderIMG 保持逻辑 ---------- */
const base = import.meta.env.BASE_URL

const renderBackImage = () => {
  const path = selectedDeck.value?.imagePath ?? 'cards/card/'
  return `${base}${path}back.jpg`
}

const renderIMG = (no: number): string => {
  const path = selectedDeck.value?.imagePath ?? 'cards/card/'
  const start = selectedDeck.value?.start ?? 0
  const fileNo = no + start
  return `${base}${path}${fileNo}.jpg`
}

/* ---------- DOM 更新与容器宽度计算（原 recalcAfterDOMUpdate 空函数现在实现） ---------- */
const recalcAfterDOMUpdate = async () => {
  await nextTick()
  if (cardStripWrapper.value) {
    containerWidth.value = cardStripWrapper.value.clientWidth
  }
}

/* ---------- 生命周期：事件监听与清理 ---------- */
onMounted(() => {
  // 初次初始化牌堆
  initShuffledDeck()

  // 监听 shift+wheel
  window.addEventListener('wheel', onWheelWithShift, { passive: false });

  // 宽度计算
  if (cardStripWrapper.value) {
    containerWidth.value = cardStripWrapper.value.clientWidth
  }

  // 响应窗口 resize，重新计算 containerWidth
  const onResize = () => {
    if (cardStripWrapper.value) {
      containerWidth.value = cardStripWrapper.value.clientWidth
    }
  }
  window.addEventListener('resize', onResize)

  // 把 resize 引用保存到变量，便于卸载
  ;(onMounted as any)._onResize = onResize
});

onBeforeUnmount(() => {
  window.removeEventListener('wheel', onWheelWithShift);
  const onResize = (onMounted as any)._onResize
  if (onResize) window.removeEventListener('resize', onResize)

  if (typedInstance) {
    typedInstance.destroy();
    typedInstance = null;
  }
  if (inertiaTween) {
    inertiaTween.kill()
    inertiaTween = null
  }
});

watch([selectedDeckKey, isSpreadConfirmed, () => shuffledDeck.value.length], recalcAfterDOMUpdate)

onMounted(() => {
  // 兼容用户在不同地方多次 mounted 调用（保留原来逻辑）
  if (cardStripWrapper.value) {
    containerWidth.value = cardStripWrapper.value.clientWidth
  }
})

onBeforeUnmount(() => {
  if (typedInstance) { typedInstance.destroy(); typedInstance = null }
})
</script>

<style scoped lang="less">
@import 'Home.less';

/* 主要增强的样式：card 内层做 3D 翻转/动画优化，并启用 will-change 提示 GPU 加速 */
.hover-info-wrapper {
  height: 140px;
  margin-bottom: 12px;
}

.spread-info-bar {
  position: relative;
  background: #fff8f0;
  padding: 6px;
  border-radius: 4px;
}

.spread-selection {
  margin-bottom: 24px;
  .spread-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
}

.spread-card {
  background: #fdf6f0;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  width: 200px;
  cursor: pointer;
  transition: all 0.2s;

  .spread-header {
    font-weight: bold;
    margin-bottom: 6px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  &.active {
    border-color: #f39c12;
    box-shadow: 0 0 0 3px rgba(243,156,18,0.2);
  }
}

.selected-spread-info {
  margin-top: 12px;
  font-size: 14px;
  color: #444;
}

/* card strip 容器（保留高度与溢出） */
.card-strip-wrapper {
  position: relative;
  width: 100%;
  overflow-x: visible;
  height: 200px;
  margin-top: 12px;
}

.card-strip {
  position: relative;
  height: 100%;
  cursor: grab;
}

/* 外层 card（保留 absolute 布局与宽度），增加 will-change */
.card {
  position: absolute;
  bottom: 0;
  width: 88px;
  transition: transform 0.22s cubic-bezier(.2,.9,.2,1), z-index 0.1s;
  will-change: transform;
  transform-origin: center bottom;
}

/* 卡牌内层，专用于翻转、上浮等动画（避免与外层 translateX 冲突） */
.card-inner {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  will-change: transform, opacity;
  /* 初始 box-shadow */
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  transition: box-shadow .25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 选中外层高亮（保留原有 .card.active） */
.card.active {
  border: 2px solid gold;
  box-shadow: 0 0 10px rgba(255,215,0,0.6);
  z-index: 100;
}

/* 卡背图片 */
.card img.card-back {
  width: 100%;
  height: auto;
  border-radius: 4px;
  display: block;
}

/* 结果展示区保留原样 */
.show-card {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.card-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-item img {
  width: 100px;
  height: auto;
}

.card-label {
  margin-top: 4px;
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .spread-list {
    flex-direction: column;
  }
  .spread-card {
    width: 100%;
  }
  .card-item img {
    width: min(22vw, 90px);
  }
  .card-label {
    font-size: 12px;
  }
}

/* slider 样式保留 */
.card-strip-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  background: #ddd;
  border-radius: 5px;
  outline: none;
  opacity: 0.7;
  transition: opacity .2s;
  margin-top: 15px;
}

.card-strip-slider:hover {
  opacity: 1;
}

.card-strip-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #f39c12;
  cursor: pointer;
  border-radius: 50%;
}

.card-strip-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #f39c12;
  cursor: pointer;
  border-radius: 50%;
}

/* 版面标题与按钮间距 */
.section-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #8b4513;
  border-bottom: 2px solid #deb887;
  padding-bottom: 8px;
  margin-bottom: 1rem;
  text-transform: uppercase;
}
.button-spacing {
  margin-top: 40px; /* 增加上外边距，向下平移 */
}
</style>
