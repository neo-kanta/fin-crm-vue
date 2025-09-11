<template>
  <div class="dashboard-view">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Dashboard Overview
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Welcome back! Here's your business performance at a glance
      </p>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="metric in keyMetrics" :key="metric.title" class="card">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {{ metric.title }}
            </p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ metric.value }}
            </p>
          </div>
          <div
            :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center',
              metric.color === 'blue'
                ? 'bg-blue-100 text-blue-600'
                : metric.color === 'green'
                ? 'bg-green-100 text-green-600'
                : metric.color === 'purple'
                ? 'bg-purple-100 text-purple-600'
                : 'bg-orange-100 text-orange-600',
            ]"
          >
            <div :class="metric.icon" class="text-2xl"></div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div
            :class="[
              'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
              metric.trend === 'up'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700',
            ]"
          >
            <div
              :class="
                metric.trend === 'up'
                  ? 'i-carbon-arrow-up'
                  : 'i-carbon-arrow-down'
              "
            ></div>
            {{ metric.change }}
          </div>
          <span class="text-xs text-gray-500">from last month</span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Pipeline Chart -->
      <div class="lg:col-span-2 card">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Sales Pipeline
          </h2>
          <div class="flex gap-2">
            <button class="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white">
              Monthly
            </button>
            <button
              class="px-3 py-1 text-sm rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              Quarterly
            </button>
          </div>
        </div>
        <VueApexCharts
          type="bar"
          :options="pipelineChartOptions"
          :series="pipelineChartOptions.series"
          height="350"
        />
      </div>

      <!-- Status Distribution -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Status Distribution
        </h2>
        <VueApexCharts
          type="donut"
          :options="statusChartOptions"
          :series="statusChartOptions.series"
          height="300"
        />
      </div>
    </div>

    <!-- Revenue Forecast -->
    <div class="card mb-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Revenue Forecast
        </h2>
        <select class="px-3 py-1 border border-gray-200 rounded-lg text-sm">
          <option>2025</option>
          <option>2024</option>
        </select>
      </div>
      <VueApexCharts
        type="area"
        :options="revenueChartOptions"
        :series="revenueChartOptions.series"
        height="350"
      />
    </div>

    <!-- Bottom Section Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Upcoming Follow-ups -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Upcoming Follow-ups
        </h2>
        <div class="space-y-4">
          <div
            v-for="followUp in upcomingFollowUps"
            :key="followUp.id"
            class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white">
                {{ followUp.name }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <!-- {{ followUp.followUp }} -->
                {{ followUp.nextActivityAt }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                <span class="i-carbon-calendar text-xs"></span>
                {{ dayjs(followUp.nextActivityAt).format("MMM DD, YYYY") }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Recent Activities
        </h2>
        <div class="space-y-4">
          <div
            v-for="activity in recentActivities"
            :key="activity.title"
            class="flex items-start gap-3"
          >
            <div
              :class="[
                'w-8 h-8 rounded-lg flex items-center justify-center',
                activity.type === 'success'
                  ? 'bg-green-100 text-green-600'
                  : activity.type === 'info'
                  ? 'bg-blue-100 text-blue-600'
                  : activity.type === 'warning'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-600',
              ]"
            >
              <div :class="activity.icon"></div>
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white text-sm">
                {{ activity.title }}
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                {{ activity.description }}
              </p>
              <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Market Insights -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Market Insights
        </h2>
        <div class="space-y-4">
          <div
            v-for="insight in marketInsights"
            :key="insight.title"
            class="border-l-4 border-blue-500 pl-4"
          >
            <div class="flex items-center gap-2 mb-1">
              <div :class="insight.icon" class="text-blue-500"></div>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ insight.title }}
              </p>
            </div>
            <p class="text-2xl font-bold text-blue-600 mb-1">
              {{ insight.value }}
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              {{ insight.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { type Contact, ContactLifecycle } from "@models/Contact";
import { type Stat } from "@models/Stat";
import dayjs from "dayjs";
import { buildKeyMetrics, stats } from '@/mock/data'

interface Props {
  contacts: Contact[];
  stats: Stat;
}

const props = withDefaults(defineProps<Props>(), {
  contacts: () => [],
  stats: () => ({ total: 0, qualified: 0, inPipeline: 0, conversionRate: 0 }),
})

const countBy = (stage: ContactLifecycle) =>
  props.contacts.filter(c => c.lifecycle === stage).length

// Chart options
const pipelineChartOptions = computed(() => ({
  chart: {
    type: "bar",
    height: 350,
    toolbar: { show: false },
  },
  series: [
  {
      name: 'Opportunities',
      data: [
        countBy(ContactLifecycle.Lead),
        countBy(ContactLifecycle.Inactive),
        countBy(ContactLifecycle.Customer),
        countBy(ContactLifecycle.MQL),
        countBy(ContactLifecycle.SQL),
      ],
    },
  ],
  xaxis: {
    categories: [
      ContactLifecycle.Lead,
      ContactLifecycle.Inactive,
      ContactLifecycle.Customer,
      ContactLifecycle.MQL,
      ContactLifecycle.SQL,
      ,
    ],
  },
  colors: ["#667eea"],
  plotOptions: {
    bar: {
      borderRadius: 8,
      horizontal: false,
      columnWidth: "50%",
    },
  },
  dataLabels: {
    enabled: true,
  },
  grid: {
    borderColor: "#f1f1f1",
  },
}));

// just mock for while
const revenueChartOptions = computed(() => ({
  chart: {
    type: "area",
    height: 350,
    toolbar: { show: false },
  },
  series: [
    {
      name: "Projected Revenue (THB Million)",
      data: [45, 52, 38, 65, 72, 85, 94],
    },
  ],
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  },
  colors: ["#764ba2"],
  stroke: {
    curve: "smooth",
    width: 3,
  },
  fill: {
    type: "gradient",
    gradient: {
      opacityFrom: 0.6,
      opacityTo: 0.1,
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    borderColor: "#f1f1f1",
  },
}));

const statusChartOptions = computed(() => ({
  chart: {
    type: "donut",
    height: 350,
  },
  series: [
    props.contacts.filter((c) => c.lifecycle === ContactLifecycle.Lead).length,
    props.contacts.filter((c) => c.lifecycle === ContactLifecycle.Inactive)
      .length,
    props.contacts.filter((c) => c.lifecycle === ContactLifecycle.Customer)
      .length,
    props.contacts.filter((c) => c.lifecycle === ContactLifecycle.MQL).length,
    props.contacts.filter((c) => c.lifecycle === ContactLifecycle.SQL).length,
  ],
  labels: ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"],
  colors: ["#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899", "#10b981"],
  legend: {
    position: "bottom",
  },
  dataLabels: {
    enabled: true,
  },
}));

// Key metrics
const keyMetrics = computed(() => buildKeyMetrics(stats))

/**
 * Investigate the recentActivities
 * types @computed
 */
const recentActivities = computed(() => [
  {
    icon: "i-carbon-user-avatar",
    title: "New contact added",
    description: "Kasikorn Asset Management",
    time: "2 hours ago",
    type: "success",
  },
  {
    icon: "i-carbon-document",
    title: "Proposal sent",
    description: "SCB Asset Management - CRM Integration",
    time: "5 hours ago",
    type: "info",
  },
  {
    icon: "i-carbon-calendar",
    title: "Meeting scheduled",
    description: "TMB Asset Management - Technical Demo",
    time: "1 day ago",
    type: "warning",
  },
  {
    icon: "i-carbon-checkmark",
    title: "Deal closed",
    description: "Bangkok Insurance - Annual Contract",
    time: "2 days ago",
    type: "success",
  },
]);

/**
 * Calculate the next follow-up time
 * types @computed
 */
const upcomingFollowUps = computed(() => {
  const today = new Date();
  return props.contacts
    .filter((c) => c.nextActivityAt && new Date(c.nextActivityAt) >= today)
    .sort(
      (a, b) =>
        new Date(String(a.nextActivityAt)).getTime() -
        new Date(String(b.nextActivityAt)).getTime()
    )
    .slice(0, 5);
});

// Market insights
const marketInsights = [
  {
    title: "Digital Transformation Trend",
    value: "78%",
    description: "of financial institutions planning CRM upgrades in 2025",
    icon: "i-carbon-growth",
  },
  {
    title: "Microsoft Integration",
    value: "65%",
    description: "prefer Microsoft-compatible solutions",
    icon: "i-carbon-partnership",
  },
  {
    title: "Average Deal Size",
    value: "฿2.5M",
    description: "for enterprise CRM implementations",
    icon: "i-carbon-currency",
  },
];
</script>

<style scoped>
.card {
  @apply bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300;
}
</style>
