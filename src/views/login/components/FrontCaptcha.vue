<template>
  <div class="s-canvas">
    <canvas id="s-canvas" :width="contentWidth" :height="contentHeight" @click="changeCaptcha" />
  </div>
</template>
<script>
export default {
  name: 'FrontCaptcha',
  data() {
    return {
      identifyCode: '1234',
      fontSizeMin: 24,
      fontSizeMax: 40,
      backgroundColorMin: 180,
      backgroundColorMax: 240,
      colorMin: 50,
      colorMax: 160,
      lineColorMin: 40,
      lineColorMax: 180,
      dotColorMin: 0,
      dotColorMax: 255,
      contentWidth: 112,
      contentHeight: 47
    }
  },
  watch: {
    identifyCode() {
      this.drawPic()
    }
  },
  mounted() {
    this.changeCaptcha()
  },
  methods: {
    // 改变图片
    changeCaptcha() {
      this.identifyCode = this.randomCaptcha()
      this.drawPic()
      this.$emit('getCaptcha', this.identifyCode)
    },
    // 生成随机验证码
    randomCaptcha() {
      const identifyCodes = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' // 62
      let res = ''
      for (let i = 0; i < 4; i++) {
        const index = this.randomNum(0, identifyCodes.length)
        res += identifyCodes.substring(index, index + 1)
      }
      return res
    },
    // 生成一个随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 生成一个随机的颜色
    randomColor(min, max) {
      var r = this.randomNum(min, max)
      var g = this.randomNum(min, max)
      var b = this.randomNum(min, max)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    drawPic() {
      var canvas = document.getElementById('s-canvas')
      var ctx = canvas.getContext('2d')
      ctx.textBaseline = 'bottom'
      // 绘制背景
      ctx.fillStyle = this.randomColor(
        this.backgroundColorMin,
        this.backgroundColorMax
      )
      ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
      // 绘制文字
      for (let i = 0; i < this.identifyCode.length; i++) {
        this.drawText(ctx, this.identifyCode[i], i)
      }
      this.drawLine(ctx)
      this.drawDot(ctx)
    },
    drawText(ctx, txt, i) {
      ctx.fillStyle = this.randomColor(this.colorMin, this.colorMax)
      ctx.font =
        this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei'
      var x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1))
      var y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
      var deg = this.randomNum(-15, 15)
      // 修改坐标原点和旋转角度
      ctx.translate(x, y)
      ctx.rotate(deg * Math.PI / 180)
      ctx.fillText(txt, 0, 0)
      // 恢复坐标原点和旋转角度
      ctx.rotate(-deg * Math.PI / 180)
      ctx.translate(-x, -y)
    },
    drawLine(ctx) {
      // 绘制干扰线
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = this.randomColor(
          this.lineColorMin,
          this.lineColorMax
        )
        ctx.beginPath()
        ctx.moveTo(
          this.randomNum(0, this.contentWidth),
          this.randomNum(0, this.contentHeight)
        )
        ctx.lineTo(
          this.randomNum(0, this.contentWidth),
          this.randomNum(0, this.contentHeight)
        )
        ctx.stroke()
      }
    },
    drawDot(ctx) {
      // 绘制干扰点
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = this.randomColor(0, 255)
        ctx.beginPath()
        ctx.arc(
          this.randomNum(0, this.contentWidth),
          this.randomNum(0, this.contentHeight),
          1,
          0,
          2 * Math.PI
        )
        ctx.fill()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .s-canvas{
    position: relative;
    width: 112px;
    height: 49px;
    line-height: 47px;
    margin: auto;

    canvas{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 112px;
      margin: auto;
    }
  }
</style>
