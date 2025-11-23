<template>
  <div class="post-card">
    <div class="post-header">
      <h3 class="post-title">{{ post.title }}</h3>
      <div class="post-meta">
        <span class="post-id">ID: {{ post.id }}</span>
        <span class="post-date" v-if="post.createdAt">
          Created: {{ formatDate(post.createdAt) }}
        </span>
      </div>
    </div>
    
    <div class="post-content">
      {{ post.content }}
    </div>

    <div class="post-footer">
      <span class="author-info">Author ID: {{ post.authorId }}</span>
      <span v-if="post.updatedAt" class="updated-date">
        Updated: {{ formatDate(post.updatedAt) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Post {
  id: number
  title: string
  content: string
  authorId: number
  createdAt?: string | null
  updatedAt?: string | null
}

defineProps<{
  post: Post
}>()

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}
</script>

<style scoped>
.post-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.post-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.post-header {
  padding: 1.5rem 1.5rem 0;
}

.post-title {
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.post-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #666;
}

.post-content {
  padding: 1rem 1.5rem;
  color: #555;
  line-height: 1.6;
  white-space: pre-wrap;
}

.post-footer {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #888;
  border-top: 1px solid #f0f0f0;
  margin-top: 1rem;
  padding-top: 1rem;
}

.author-info {
  font-weight: 500;
}

@media (max-width: 768px) {
  .post-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .post-meta {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>