<template>
	<div class="progress-bar">
		<div class="progress" :class="status" :style="{ width: progress + '%' }" />
	</div>
</template>
<script>
export default {
    name: 'ProgressBar',
    props: {
        value: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 0,
        },
        invertColors: Boolean,
    },
    computed: {
        progress: function() {
            return Math.round((this.value / this.max) * 100)
        },
        status: function() {
            if (this.progress <= 33) {
                return this.invertColors ? 'danger' : 'good'
            }

            if (this.progress <= 66) {
                return 'warn'
            }

            if (this.progress <= 100) {
                return this.invertColors ? 'good' : 'danger'
            }

            return ''
        },
    },
}
</script>
<style scoped>
.progress-bar {
  height: 0.5em;
  background: #f1f1f1;
  border-radius: 1em;
  overflow: hidden;
}
.progress {
  height: 100%;
  width: 0%;
  transition: width ease-in-out 0.5s;
}
.progress.good {
  background: var(--good-color);
}
.progress.warn {
  background: var(--warn-color);
}
.progress.danger {
  background: var(--danger-color);
}
</style>
