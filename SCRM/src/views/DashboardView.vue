<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in displayStats" :key="stat.label" class="card">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm text-gray-600 font-medium">{{ stat.label }}</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">
              {{ stat.prefix }}{{ formatValue(stat.value) }}{{ stat.suffix }}
            </p>
            <div class="mt-2 flex items-center text-sm">
              <span
                :class="[
                  'flex items-center',
                  stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                ]"
              >
                <span :class="stat.change >= 0 ? 'i-carbon-arrow-up' : 'i-carbon-arrow-down'"></span>
                {{ Math.abs(stat.change) }}%
              </span>
              <span class="text-gray-500 ml-2">from last month</span>
            </div>
          </div>
          <div
            :class="[
              'p-3 rounded-lg',
              stat.iconBg || 'bg-purple-100'
            ]"
          >
            <span :class="[stat.icon, 'text-2xl', stat.iconColor || 'text-purple-600']"></span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import type { DashboardMetrics } from '../types'
  
  const props = defineProps<{
    stats: DashboardMetrics
  }>()
  
  const displayStats = computed(() => [
    {
      label: 'Total Accounts',
      value: props.stats.totalAccounts,
      change: 12,
      icon: 'i-carbon-user-multiple',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Active Deals',
      value: props.stats.activeDeals,
      change: 5,
      icon: 'i-carbon-chart-line',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      label: 'Pipeline Value',
      value: props.stats.pipelineValue,
      prefix: '$',
      change: 18,
      icon: 'i-carbon-currency-dollar',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      label: 'Follow-ups Due',
      value: props.stats.followUpsDue,
      suffix: ` (${props.stats.overdueCount} overdue)`,
      change: -3,
      icon: 'i-carbon-calendar',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ])
  
  function formatValue(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M'
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K'
    }
    return value.toString()
  }
  </script>
  