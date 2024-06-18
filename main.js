const canvas = new fabric.Canvas('canvas', {
  width: 1000,
  height: window.innerHeight,
  hoverCursor: 'default',
  selection: false,
  // isDrawingMode: true,
})

let line
let mouseDown = false
let currentIndex = -1
let drawedIndex = -1

// canvas.on('mouse:down', (o) => {
//   mouseDown = true
//   const pointer = canvas.getPointer(o.e)
//   line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
//     stroke: 'red',
//     strokeWidth: 3,
//   })

//   canvas.add(line)
//   canvas.requestRenderAll()
// })
canvas.on('mouse:move', (o) => {
  if (mouseDown) {
    const pointer = canvas.getPointer(o.e)
    line.set({ x2: pointer.x, y2: pointer.y })

    canvas.requestRenderAll()
  }
})
canvas.on('mouse:up', () => {
  mouseDown = false
})

const leftCircles = []
const rightCircles = []
//const redLines = []

for (let i = 0; i < 3; i++) {
  leftPos = 204 + 50
  topPos = i * 204 + i * 20 + 102

  const c = new fabric.Circle({
    left: leftPos,
    top: topPos,
    strokeWidth: 4,
    radius: 12,
    fill: '#fff',
    stroke: '#666',
  })
  c.hasControls = c.hasBorders = false
  c.lockMovementX = true
  c.lockMovementY = true
  c.lockScalingX = true
  c.lockScalingY = true
  c.lockRotation = true

  c.on('mousedown', (o) => {
    currentIndex = i
    mouseDown = true
    c.set('fill', 'red')
    const pointer = canvas.getPointer(o.e)
    line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      stroke: 'red',
      strokeWidth: 3,
      strokeDashArray: [5, 5],
    })

    canvas.add(line)
    canvas.requestRenderAll()
    // console.log(`left-${i}-over`)
  })

  c.on('mouseup', (o) => {
    let lineDone = false

    rightCircles.forEach((c, idx) => {
      if (
        c.left <= o.pointer.x &&
        o.pointer.x <= c.left + 28 &&
        c.top <= o.pointer.y &&
        o.pointer.y <= c.top + 28
      ) {
        c.set('fill', 'red')
        lineDone = true
        canvas.requestRenderAll()

        const lines = canvas.getObjects('line')
        lines[lines.length - 1].leftIndex = currentIndex
        lines[lines.length - 1].rightIndex = idx

        if (lines.length > 1) {
          for (let i = 0; i < lines.length - 1; i++) {
            if (
              lines[i].leftIndex === currentIndex &&
              lines[i].rightIndex === idx
            ) {
              canvas.remove(lines[i])
            } else {
              if (lines[i].leftIndex === currentIndex) {
                canvas.remove(lines[i])
                rightCircles[lines[i].rightIndex].set('fill', 'white')
              }
              if (lines[i].rightIndex === idx) {
                canvas.remove(lines[i])
                leftCircles[lines[i].leftIndex].set('fill', 'white')
              }
            }
          }
        }
        //   redLines.push([currentIndex, idx])
        currentIndex = -1
        console.log(canvas.getObjects('line').length)
      }
    })

    if (!lineDone) {
      const lines = canvas.getObjects('line')
      canvas.remove(lines[lines.length - 1])

      // redLines.forEach((line, idx) => {
      //   if (line[0] === currentIndex) {
      //     drawedIndex = idx
      //     return false
      //   }
      // })
      lines.forEach((l, idx) => {
        if (l.leftIndex === currentIndex) {
          drawedIndex = idx
          return false
        }
      })
      if (drawedIndex === -1) {
        leftCircles[currentIndex].set('fill', 'white')
      }
      drawedIndex = -1
    }
  })

  leftCircles.push(c)
  canvas.add(c)
}

for (let i = 0; i < 3; i++) {
  leftPos = 804 - 50
  topPos = i * 204 + i * 20 + 102

  const c = new fabric.Circle({
    left: leftPos,
    top: topPos,
    strokeWidth: 4,
    radius: 12,
    fill: '#fff',
    stroke: '#666',
  })
  c.hasControls = c.hasBorders = false
  c.lockMovementX = true
  c.lockMovementY = true
  c.lockScalingX = true
  c.lockScalingY = true
  c.lockRotation = true

  c.on('mousedown', (o) => {
    currentIndex = i
    mouseDown = true
    c.set('fill', 'red')
    const pointer = canvas.getPointer(o.e)
    line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      stroke: 'red',
      strokeWidth: 3,
      strokeDashArray: [5, 5],
    })

    canvas.add(line)
    canvas.requestRenderAll()
  })

  c.on('mouseup', (o) => {
    let lineDone = false

    leftCircles.forEach((c, idx) => {
      if (
        c.left <= o.pointer.x &&
        o.pointer.x <= c.left + 28 &&
        c.top <= o.pointer.y &&
        o.pointer.y <= c.top + 28
      ) {
        c.set('fill', 'red')
        lineDone = true
        canvas.requestRenderAll()

        const lines = canvas.getObjects('line')
        lines[lines.length - 1].leftIndex = idx
        lines[lines.length - 1].rightIndex = currentIndex

        if (lines.length > 1) {
          for (let i = 0; i < lines.length - 1; i++) {
            if (
              lines[i].leftIndex === idx &&
              lines[i].rightIndex === currentIndex
            ) {
              canvas.remove(lines[i])
            } else {
              if (lines[i].leftIndex === idx) {
                canvas.remove(lines[i])
                rightCircles[lines[i].rightIndex].set('fill', 'white')
              }
              if (lines[i].rightIndex === currentIndex) {
                canvas.remove(lines[i])
                leftCircles[lines[i].leftIndex].set('fill', 'white')
              }
            }
          }
        }

        currentIndex = -1
        console.log(canvas.getObjects('line').length)
      }
    })

    if (!lineDone) {
      const lines = canvas.getObjects('line')
      canvas.remove(lines[lines.length - 1])

      lines.forEach((l, idx) => {
        if (l.rightIndex === currentIndex) {
          drawedIndex = idx
          return false
        }
      })
      if (drawedIndex === -1) {
        rightCircles[currentIndex].set('fill', 'white')
      }
      drawedIndex = -1
    }
  })

  rightCircles.push(c)
  canvas.add(c)
}

const cards = document.querySelectorAll('.card')

cards.forEach((card) => {
  card.addEventListener('click', click)
})

function click(event) {
  const elem = event.currentTarget
  if (elem.style.transform == 'rotateY(180deg)') {
    elem.style.transform = 'rotateY(0deg)'
  } else {
    elem.style.transform = 'rotateY(180deg)'
  }
}

const reset = document.querySelector('#reset-button')
reset.addEventListener('click', () => {
  cards.forEach((card) => {
    card.style.transform = 'rotateY(0deg)'
  })

  const objects = canvas.getObjects('line')
  for (let i in objects) {
    canvas.remove(objects[i])
  }

  // redLines.length = 0

  leftCircles.forEach((c) => {
    c.set('fill', 'white')
  })
  rightCircles.forEach((c) => {
    c.set('fill', 'white')
  })

  currentIndex = -1
  drawedIndex = -1
  canvas.requestRenderAll()
})

// fabric.Image.fromURL('./9.jpeg', function (image) {
//   // globalImage = image
//   // image.filters = [duotoneFilter]
//   // image.scaleToWidth(480)
//   // image.applyFilters()
//   image.lockMovementX = true
//   image.lockMovementY = true
//   image.lockScalingX = true
//   image.lockScalingY = true
//   image.lockRotation = true
//   image.hasControls = image.hasBorders = false
//   image.on('mousedown', () => {
//     // image.animate(
//     //   { angle: 45 },
//     //   {
//     //     onChange: canvas.renderAll.bind(canvas),
//     //     duration: 1000,
//     //     easing: fabric.util.ease.easeOutBounce,
//     //   }
//     // )
//   })

//   canvas.add(image)
// })
// fabric.Image.fromURL('./splash.png', function (image) {
//   // globalImage = image
//   // image.filters = [duotoneFilter]
//   // image.scaleToWidth(480)
//   // image.applyFilters()
//   image.scaleToWidth(300)
//   image.lockMovementX = true
//   image.lockMovementY = true
//   image.lockScalingX = true
//   image.lockScalingY = true
//   image.lockRotation = true
//   image.hasControls = image.hasBorders = false
//   image.on('mousedown', () => {
//     console.log('back')
//   })

//   canvas.add(image)
// })
