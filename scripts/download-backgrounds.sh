#!/bin/bash

# 背景资源一键下载脚本
# 自动下载所有视频文件并生成 Poster 封面图

set -e  # 遇到错误立即退出

echo "🚀 开始下载背景资源..."

# 创建目录
mkdir -p public/assets/videos

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 视频资源映射
declare -A VIDEOS=(
  ["golden-flow"]="https://cdn.midjourney.com/video/b84b7c1b-df4c-415a-915f-eb3a46e28f88/1.mp4"
  ["energy-field"]="https://cdn.midjourney.com/video/73a6b711-fbab-490c-a0b9-f3e811e37ead/3.mp4"
  ["resonance-wave"]="https://cdn.midjourney.com/video/661ffc10-0d89-43d1-b8f9-83e67d0421ae/2.mp4"
  ["zen-vortex"]="https://cdn.midjourney.com/video/7e901a1c-929f-466d-8def-ac47f9d0c15b/3.mp4"
)

# 占位颜色映射
declare -A COLORS=(
  ["golden-flow"]="#0A0A0F"
  ["energy-field"]="#1A1A2E"
  ["resonance-wave"]="#2A2A3E"
  ["zen-vortex"]="#EBC862"
)

# 下载视频
for name in "${!VIDEOS[@]}"; do
  url="${VIDEOS[$name]}"
  output="public/assets/videos/${name}.mp4"

  if [ -f "$output" ]; then
    echo -e "${YELLOW}⏭️  跳过 $name.mp4 (已存在)${NC}"
  else
    echo -e "${GREEN}📥 下载 $name.mp4...${NC}"
    curl -L -o "$output" "$url" || {
      echo -e "${YELLOW}⚠️  下载失败: $name.mp4(将使用占位图)${NC}"
      rm -f "$output"
    }
  fi
done

echo ""
echo "🖼️  生成 Poster 封面图..."

# 检查是否安装了 ffmpeg
if command -v ffmpeg &> /dev/null; then
  # 使用 ffmpeg 提取封面图
  for name in "${!VIDEOS[@]}"; do
    video="public/assets/videos/${name}.mp4"
    poster="public/assets/videos/${name}-poster.jpg"

    if [ ! -f "$video" ]; then
      echo -e "${YELLOW}⏭️  跳过 $name-poster.jpg (视频不存在)${NC}"
      continue
    fi

    if [ -f "$poster" ]; then
      echo -e "${YELLOW}⏭️  跳过 $name-poster.jpg (已存在)${NC}"
    else
      echo -e "${GREEN}🎨 提取 $name-poster.jpg...${NC}"
      ffmpeg -i "$video" -vframes 1 -q:v 2 "$poster" -y > /dev/null 2>&1 || {
        echo -e "${YELLOW}⚠️  提取失败: $name-poster.jpg (将使用纯色占位)${NC}"
      }
    fi
  done
elif command -v convert &> /dev/null; then
  # 使用 ImageMagick 创建纯色占位图
  echo -e "${YELLOW}⚠️  未安装 ffmpeg，使用 ImageMagick 创建纯色占位图${NC}"

  for name in "${!COLORS[@]}"; do
    poster="public/assets/videos/${name}-poster.jpg"
    color="${COLORS[$name]}"

    if [ -f "$poster" ]; then
      echo -e "${YELLOW}⏭️  跳过 $name-poster.jpg (已存在)${NC}"
    else
      echo -e "${GREEN}🎨 创建 $name-poster.jpg (颜色: $color)${NC}"
      convert -size 1920x1080 "xc:$color" "$poster" || {
        echo -e "${YELLOW}⚠️  创建失败: $name-poster.jpg${NC}"
      }
    fi
  done
else
  # 降级：复制现有图片资源作为占位
  echo -e "${YELLOW}⚠️  未安装 ffmpeg 或 ImageMagick，使用现有图片作为占位${NC}"

  if [ -f "src/assets/227c82c549f3edf64f327b2a617f0246.jpg" ]; then
    cp "src/assets/227c82c549f3edf64f327b2a617f0246.jpg" "public/assets/videos/golden-flow-poster.jpg" 2>/dev/null || true
    cp "src/assets/8971db7e712d3f6f3a46e2c0b25dc407.jpg" "public/assets/videos/energy-field-poster.jpg" 2>/dev/null || true
    cp "src/assets/227c82c549f3edf64f327b2a617f0246.jpg" "public/assets/videos/resonance-wave-poster.jpg" 2>/dev/null || true
    cp "src/assets/8971db7e712d3f6f3a46e2c0b25dc407.jpg" "public/assets/videos/zen-vortex-poster.jpg" 2>/dev/null || true
  fi
fi

echo ""
echo "✅ 资源下载完成！"
echo ""
echo "📊 文件清单:"
ls -lh public/assets/videos/

echo ""
echo "🧪 验证方法:"
echo "  1. 启动开发服务器: npm run dev"
echo "  2. 在浏览器中访问: http://localhost:5173/assets/videos/golden-flow.mp4"
echo "  3. 检查控制台日志是否有: ✅ 核心背景资源预加载完成"
echo ""
echo "📖 详细文档: 查看 BACKGROUND_ASSETS_GUIDE.md"
