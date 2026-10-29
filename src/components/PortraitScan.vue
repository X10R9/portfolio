<script setup>
const lines = Array.from({ length: 92 }, (_, i) => {
  const y = 62 + i * 6
  const amp = 1.5 + (i % 7)
  return {
    d: `M -20 ${y} C 110 ${y - amp} 330 ${y + amp} 500 ${y}`,
    strong: i % 9 === 0
  }
})
</script>

<template>
  <svg
    class="scan"
    viewBox="0 0 480 600"
    preserveAspectRatio="xMidYMid slice"
    role="img"
    aria-label="徐茹的抽象线稿人像"
  >
    <defs>
      <linearGradient id="bustFill" x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0" stop-color="#1d252a" />
        <stop offset="0.55" stop-color="#141a1e" />
        <stop offset="1" stop-color="#0f1417" />
      </linearGradient>
      <radialGradient id="scanGlow" cx="0.62" cy="0.34" r="0.55">
        <stop offset="0" stop-color="#d7a36b" stop-opacity="0.2" />
        <stop offset="1" stop-color="#d7a36b" stop-opacity="0" />
      </radialGradient>
      <clipPath id="bustClip">
        <path
          d="M210 96
             C285 96 326 150 332 220
             C334 246 327 268 319 286
             C312 302 318 314 330 330
             C346 352 354 372 342 382
             C333 390 320 387 312 392
             C303 398 306 408 316 416
             C326 424 324 436 312 444
             C300 452 300 466 312 478
             C326 492 348 502 368 514
             C408 538 436 572 446 600
             L34 600
             C44 560 62 528 92 506
             C128 480 168 462 186 432
             C196 416 197 396 194 376
             C188 340 174 312 162 282
             C146 242 146 188 160 152
             C174 116 190 96 210 96 Z"
        />
      </clipPath>
    </defs>

    <rect width="480" height="600" fill="url(#scanGlow)" />
    <rect width="480" height="600" fill="url(#bustFill)" opacity="0.9" />

    <g clip-path="url(#bustClip)">
      <rect width="480" height="600" fill="url(#bustFill)" />
      <path
        v-for="(line, i) in lines"
        :key="i"
        :d="line.d"
        :stroke="line.strong ? 'rgba(215, 163, 107, 0.3)' : 'rgba(236, 233, 225, 0.13)'"
        :stroke-width="line.strong ? 0.9 : 0.6"
        fill="none"
      />
      <path
        d="M300 180 L300 470"
        stroke="rgba(215, 163, 107, 0.15)"
        stroke-width="0.7"
        stroke-dasharray="2 7"
      />
    </g>

    <path
      d="M210 96
         C285 96 326 150 332 220
         C334 246 327 268 319 286
         C312 302 318 314 330 330
         C346 352 354 372 342 382
         C333 390 320 387 312 392
         C303 398 306 408 316 416
         C326 424 324 436 312 444
         C300 452 300 466 312 478
         C326 492 348 502 368 514
         C408 538 436 572 446 600"
      fill="none"
      stroke="rgba(236, 233, 225, 0.34)"
      stroke-width="1.1"
    />

    <path
      d="M332 220
         C334 246 327 268 319 286
         C312 302 318 314 330 330
         C346 352 354 372 342 382
         C333 390 320 387 312 392
         C303 398 306 408 316 416
         C326 424 324 436 312 444
         C300 452 300 466 312 478
         C326 492 348 502 368 514
         C408 538 436 572 446 600"
      fill="none"
      stroke="rgba(215, 163, 107, 0.55)"
      stroke-width="1"
    />
  </svg>
</template>

<style scoped>
.scan {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
