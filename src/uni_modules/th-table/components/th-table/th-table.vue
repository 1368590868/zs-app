<template>
	<uni-table :loading="loading" :border="border" :stripe="stripe" emptyText="" :type="type">
		<uni-tr>
			<uni-th v-for="item in column " :align="item.align || 'center'"
				:style="{ position: item.isFixed ? 'sticky' : '', left: item.fixedW || 0, background: '#F7F8FA', zIndex: item.isFixed ? '1' : '', minHeight: '70rpx', fontSize: thsize ? thsize + 'rpx' : '26rpx' }"
				:width="item.width ? item.width * 50 : ''"
				:class="[item.isSort ? 'sortDefault' : '', item.key == st ? (sr == -1 ? 'sortBottom' : 'sortTop') : '']"
				@click="item.isSort ? checkSort(item.key, item.key === st ? (sr === -1 ? 1 : -1) : -1) : ''">
				<view class="span1" :class="item.isSort ? 'span' : ''">{{ item.title }}</view>
			</uni-th>
		</uni-tr>
		<uni-tr v-for="item in listData" :key="item.SECURITY_CODE" v-if="listData">
			<uni-td v-for="item1, index in column" :key="index"
				:style="{ position: item1.isFixed ? 'sticky' : '', left: item1.fixedW || 0, background: '#fff', zIndex: item1.isFixed ? '1' : '', height: `${height * 100}rpx`, minHeight: '80rpx', fontSize: tdsize ? tdsize + 'rpx' : '' }"
				:align="item.align || 'center'" @click="tdClick ? tdClick(item) : ''">
				<template v-if="item1.slot">
					<slot :item="item" :name="item1.slot"></slot>
				</template>
				<template v-else>
					{{ item[item1.key] ? item[item1.key] : '-' }}
				</template>
			</uni-td>
		</uni-tr>
	</uni-table>
	<view class="empty" v-if="!listData || listData.length == 0">
		<image :src="icon? icon:'https://u.southmoney.com/fed/images/msouthmoney/listNull.png'" mode="scaleToFill" style="width: 432rpx;height: 302rpx;" v-if="icon" />
		<text>{{ emptyText ? emptyText : '暂无数据' }}</text>
	</view>
</template>

<script setup>
const props = defineProps({
	stripe: Boolean,
	border: Boolean,
	column: Array,
	listData: Array,
	checkSort: Function,
	tdClick: Function,
	st: String,
	sr: Number,
	loading: Boolean,
	height: String,
	type: String,
	tdsize: Number,
	thsize: Number,
	icon: String,
	emptyText: String
})
</script>

<style lang="scss" scoped>
:deep(.uni-table-loading) {
	display: none;
}

.sortDefault {
	.span1 {
		position: relative;
	}

	.span1::after {
		position: absolute;
		/* display: inline-block; */
		content: '';
		right: -16rpx;
		bottom: 0;
		border-bottom: 10rpx solid #999;
		border-left: 10rpx solid transparent;
	}
}

.sortBottom,
.sortTop {
	.span {
		position: relative;
		color: #ff9900;
	}

	.span::after {
		right: -20rpx !important;
		top: 50%;
		bottom: initial;
		transform: translateY(-50%);
		border: none;
	}
}

.sortBottom {
	.span::after {
		content: '↓';
	}
}

.sortTop {
	.span::after {
		content: '↑';
	}
}

.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	font-size: 32rpx;
	color: #999;
	padding-bottom: 80rpx;
}
</style>