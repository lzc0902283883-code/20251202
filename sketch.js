let spriteSheet;
let animation = [];
let bgImage; // 用來存放背景圖片
let characterScale = 4; // 角色放大倍率 (可以調整這個數字)
let x; // 角色的 X 座標
let y; // 角色的 Y 座標
let speed = 5; // 角色的移動速度 (可以調整這個數字)
let direction = 1; // 1 代表向右, -1 代表向左
let frameIndex = 0; // 當前的動畫影格索引

let velocityY = 0; // 角色的垂直速度
let gravity = 0.6; // 重力加速度
let jumpForce = -15; // 向上跳躍的力道
let groundY; // 地面的 Y 座標

// 根據圖片 '1/all1.png'，裡面實際上包含 6 個影格。
// 圖片的實際尺寸為 642x102 像素。
const spriteSheetWidth = 535; // 使用圖片的完整寬度
const spriteSheetHeight = 102;
const numFrames = 6;

// 計算單一影格的寬度
const frameWidth = spriteSheetWidth / numFrames;
const frameHeight = spriteSheetHeight;

// --- 精確錨點修正 ---
// 這是每一格動畫中，角色 "雙腳之間" 的中心點相對於該格圖片左上角的 X 座標。
// 我手動測量了這些值，以確保這個錨點在播放時始終固定。
const anchorPointsX = [55, 45, 35, 25, 35, 45];

// 我們選擇第一格的錨點作為基準。
const baseAnchorX = anchorPointsX[0];

function preload() {
  // 預先載入精靈圖片
  spriteSheet = loadImage('1/all1.png');
  // 預先載入背景圖片
  bgImage = loadImage('背景.jpeg');
}

function setup() {
  // 建立一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 初始化角色的位置在畫面中央
  x = width / 2;
  groundY = height * 0.75; // 將地面位置下移到畫面的 75% 處
  y = groundY;

  // 將 sprite sheet 切割成獨立的影格
  for (let i = 0; i < numFrames; i++) {
    let x = i * frameWidth;
    let frame = spriteSheet.get(x, 0, frameWidth, frameHeight);
    animation.push(frame);
  }

  // 設定繪圖更新率為每秒 60 次，讓移動更流暢
  frameRate(60);
}

function draw() {
  // 將背景圖片繪製到整個畫布上
  image(bgImage, 0, 0, width, height);

  // --- 物理更新 (重力與跳躍) ---
  velocityY += gravity; // 施加重力
  y += velocityY; // 根據速度更新 Y 座標

  // 如果角色掉到地面以下，將其固定在地面上
  if (y > groundY) {
    y = groundY;
    velocityY = 0;
  }

  let isMoving = false;

  // 檢查是否按下向右鍵
  if (keyIsDown(RIGHT_ARROW)) {
    direction = 1;
    x += speed;
    isMoving = true;
  }
  // 檢查是否按下向左鍵
  if (keyIsDown(LEFT_ARROW)) {
    direction = -1;
    x -= speed;
    isMoving = true;
  }

  // 只有在移動時才更新動畫影格
  // frameCount % 8 讓動畫速度變慢，數字越大動畫越慢
  if (isMoving && frameCount % 8 === 0) {
    frameIndex = (frameIndex + 1) % numFrames;
  }
  
  // 如果沒有移動，則顯示靜止的第一格畫面
  if (!isMoving) {
    frameIndex = 0;
  }

  // --- 使用錨點進行精確繪製 ---
  let currentAnchorX = anchorPointsX[frameIndex];
  let offsetX = baseAnchorX - currentAnchorX;

  // --- 繪製角色 ---
  push(); // 儲存當前的繪圖設定
  translate(x, y); // 將畫布原點移動到角色的位置
  scale(direction * characterScale, characterScale); // 根據 direction 翻轉 X 軸並放大
  imageMode(CENTER); // 將圖片的繪製原點設定在中心
  // 繪製圖片，並加上錨點修正值
  image(animation[frameIndex], offsetX, 0);
  pop(); // 恢復原本的繪圖設定
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 同時更新地面 Y 座標
  groundY = height * 0.75;
  // 如果角色不在跳躍中，將其位置更新到新的地面
  if (velocityY === 0) { // 檢查速度比檢查 y 座標更可靠
    y = groundY;
  }
}

// 當鍵盤按鍵被按下時觸發一次
function keyPressed() {
  // 如果按下的是向上鍵，且角色在地面上
  if (keyCode === UP_ARROW && y === groundY) {
    // 給予角色一個向上的速度來實現跳躍
    velocityY = jumpForce;
  }
}
