<template>
  <div class="card">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Recent Activities</h3>
      <button class="text-sm text-purple-600 hover:text-purple-800">
        View all →
      </button>
    </div>

    <div class="space-y-3">
      <div
        v-for="activity in activities.slice(0, 5)"
        :key="activity.id"
        class="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0"
      >
        <div :class="['p-2 rounded-lg', getActivityColor(activity.type).bg]">
          <span
            :class="[
              getActivityIcon(activity.type),
              'text-lg',
              getActivityColor(activity.type).icon,
            ]"
          ></span>
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900">
            {{ activity.subject }}
          </p>
          <p class="text-sm text-gray-500 truncate">
            {{ activity.description }}
          </p>
          <div class="mt-1 flex items-center space-x-2 text-xs text-gray-400">
            <span>{{ formatRelativeTime(String(activity.updatedAt)) }}</span>
            <span>·</span>
            <span>{{ activity.assigneeId }}</span>
            <span
              v-if="String(activity.status) === 'completed'"
              class="text-green-600"
              >✓</span
            >
          </div>
        </div>
      </div>
    </div>

    <div v-if="activities.length === 0" class="text-center py-8 text-gray-500">
      No recent activities
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Activity } from "@models/Activity";

defineProps<{
  activities: Activity[];
}>();

function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    Call: "i-carbon-phone",
    Email: "i-carbon-email",
    Meeting: "i-carbon-calendar",
    Task: "i-carbon-task",
    Note: "i-carbon-document",
  };
  return icons[type] || "i-carbon-dot-mark";
}

function getActivityColor(type: string) {
  const colors: Record<string, { bg: string; icon: string }> = {
    Call: { bg: "bg-blue-100", icon: "text-blue-600" },
    Email: { bg: "bg-purple-100", icon: "text-purple-600" },
    Meeting: { bg: "bg-green-100", icon: "text-green-600" },
    Task: { bg: "bg-orange-100", icon: "text-orange-600" },
    Note: { bg: "bg-gray-100", icon: "text-gray-600" },
  };
  return colors[type] || { bg: "bg-gray-100", icon: "text-gray-600" };
}

function formatRelativeTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return then.toLocaleDateString();
}
</script>
