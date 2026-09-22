param(
  [Parameter(Mandatory = $true)]
  [string]$Source
)

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$brandDir = Join-Path $root "public/brand"
$iconDir = Join-Path $root "public/icons"
$ogDir = Join-Path $root "public/og"
New-Item -ItemType Directory -Force -Path $brandDir, $iconDir, $ogDir | Out-Null
$sourceAsset = Join-Path $brandDir "site-icon-source.png"
Copy-Item -LiteralPath $Source -Destination $sourceAsset -Force

$teal = [System.Drawing.ColorTranslator]::FromHtml("#17383b")
$deepTeal = [System.Drawing.ColorTranslator]::FromHtml("#102a2d")
$mint = [System.Drawing.ColorTranslator]::FromHtml("#87dfcd")
$offWhite = [System.Drawing.ColorTranslator]::FromHtml("#f5f3e9")
$muted = [System.Drawing.ColorTranslator]::FromHtml("#aac3bd")

function New-Graphics([System.Drawing.Bitmap]$bitmap) {
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  return $graphics
}

function Save-SquareIcon([string]$path, [int]$size, [double]$scale) {
  $source = [System.Drawing.Image]::FromFile($sourceAsset)
  $bitmap = [System.Drawing.Bitmap]::new($size, $size)
  $graphics = New-Graphics $bitmap
  $graphics.Clear($teal)
  $drawSize = [int]($size * $scale)
  $offset = [int](($size - $drawSize) / 2)
  $graphics.DrawImage($source, $offset, $offset, $drawSize, $drawSize)
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
  $source.Dispose()
}

function Save-SmallIcon([string]$path) {
  $canvas = [System.Drawing.Bitmap]::new(256, 256)
  $graphics = New-Graphics $canvas
  $graphics.Clear($teal)
  $mintBrush = [System.Drawing.SolidBrush]::new($mint)
  $whiteBrush = [System.Drawing.SolidBrush]::new($offWhite)
  $tealPen = [System.Drawing.Pen]::new($teal, 12)
  $tealPen.StartCap = $tealPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

  $spark = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(128, 22),
    [System.Drawing.PointF]::new(142, 50),
    [System.Drawing.PointF]::new(170, 64),
    [System.Drawing.PointF]::new(142, 78),
    [System.Drawing.PointF]::new(128, 106),
    [System.Drawing.PointF]::new(114, 78),
    [System.Drawing.PointF]::new(86, 64),
    [System.Drawing.PointF]::new(114, 50)
  )
  $graphics.FillPolygon($mintBrush, $spark)

  $leftTop = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(34, 92), [System.Drawing.PointF]::new(74, 94),
    [System.Drawing.PointF]::new(113, 116), [System.Drawing.PointF]::new(120, 151),
    [System.Drawing.PointF]::new(83, 129), [System.Drawing.PointF]::new(34, 128)
  )
  $rightTop = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(222, 92), [System.Drawing.PointF]::new(182, 94),
    [System.Drawing.PointF]::new(143, 116), [System.Drawing.PointF]::new(136, 151),
    [System.Drawing.PointF]::new(173, 129), [System.Drawing.PointF]::new(222, 128)
  )
  $graphics.FillPolygon($whiteBrush, $leftTop)
  $graphics.FillPolygon($whiteBrush, $rightTop)

  $leftBottom = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(34, 141), [System.Drawing.PointF]::new(76, 144),
    [System.Drawing.PointF]::new(116, 169), [System.Drawing.PointF]::new(121, 213),
    [System.Drawing.PointF]::new(80, 185), [System.Drawing.PointF]::new(34, 181)
  )
  $rightBottom = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(222, 141), [System.Drawing.PointF]::new(180, 144),
    [System.Drawing.PointF]::new(140, 169), [System.Drawing.PointF]::new(135, 213),
    [System.Drawing.PointF]::new(176, 185), [System.Drawing.PointF]::new(222, 181)
  )
  $graphics.FillPolygon($mintBrush, $leftBottom)
  $graphics.FillPolygon($mintBrush, $rightBottom)
  $graphics.DrawLine($tealPen, 128, 113, 128, 218)

  $graphics.FillEllipse($mintBrush, 162, 157, 67, 67)
  $graphics.DrawEllipse($tealPen, 162, 157, 67, 67)
  $graphics.DrawArc($tealPen, 178, 170, 37, 37, 25, 300)
  $graphics.DrawArc($tealPen, 187, 179, 20, 20, 20, 300)
  $graphics.FillEllipse($mintBrush, 141, 210, 48, 21)
  $graphics.FillEllipse($mintBrush, 199, 220, 42, 18)

  $small = [System.Drawing.Bitmap]::new(32, 32)
  $smallGraphics = New-Graphics $small
  $smallGraphics.DrawImage($canvas, 0, 0, 32, 32)
  $small.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $smallGraphics.Dispose()
  $small.Dispose()
  $tealPen.Dispose()
  $mintBrush.Dispose()
  $whiteBrush.Dispose()
  $graphics.Dispose()
  $canvas.Dispose()
}

function Get-Font([float]$size, [System.Drawing.FontStyle]$style) {
  foreach ($name in @("Yu Gothic UI", "Meiryo UI", "Arial")) {
    try { return [System.Drawing.Font]::new($name, $size, $style, [System.Drawing.GraphicsUnit]::Pixel) } catch {}
  }
  return [System.Drawing.Font]::new([System.Drawing.FontFamily]::GenericSansSerif, $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

function Save-Ogp([string]$path, [string]$eyebrow, [string]$title, [string]$subtitle, [string]$footer) {
  $bitmap = [System.Drawing.Bitmap]::new(1200, 630)
  $graphics = New-Graphics $bitmap
  $graphics.Clear($deepTeal)
  $graphics.FillRectangle([System.Drawing.SolidBrush]::new($teal), 0, 0, 1200, 14)
  $graphics.FillRectangle([System.Drawing.SolidBrush]::new($mint), 74, 94, 8, 440)

  $eyebrowFont = Get-Font 22 ([System.Drawing.FontStyle]::Bold)
  $titleFont = Get-Font 58 ([System.Drawing.FontStyle]::Bold)
  $subtitleFont = Get-Font 30 ([System.Drawing.FontStyle]::Regular)
  $footerFont = Get-Font 22 ([System.Drawing.FontStyle]::Regular)
  $mintBrush = [System.Drawing.SolidBrush]::new($mint)
  $whiteBrush = [System.Drawing.SolidBrush]::new($offWhite)
  $mutedBrush = [System.Drawing.SolidBrush]::new($muted)
  $graphics.DrawString($eyebrow, $eyebrowFont, $mintBrush, 116, 116)
  $graphics.DrawString($title, $titleFont, $whiteBrush, 108, 185)
  $subtitleRect = [System.Drawing.RectangleF]::new(112, 282, 690, 110)
  $graphics.DrawString($subtitle, $subtitleFont, $whiteBrush, $subtitleRect)
  $graphics.DrawString($footer, $footerFont, $mutedBrush, 114, 458)

  $icon = [System.Drawing.Image]::FromFile($sourceAsset)
  $graphics.DrawImage($icon, 865, 148, 250, 250)
  $graphics.DrawString("nullcontroller.github.io", $footerFont, $mutedBrush, 862, 500)

  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $icon.Dispose()
  foreach ($item in @($eyebrowFont, $titleFont, $subtitleFont, $footerFont, $mintBrush, $whiteBrush, $mutedBrush)) { $item.Dispose() }
  $graphics.Dispose()
  $bitmap.Dispose()
}

Save-SmallIcon (Join-Path $iconDir "favicon-32x32.png")
Save-SquareIcon (Join-Path $iconDir "icon-192.png") 192 1.0
Save-SquareIcon (Join-Path $iconDir "icon-512.png") 512 1.0
Save-SquareIcon (Join-Path $iconDir "apple-touch-icon.png") 180 0.9
Save-SquareIcon (Join-Path $iconDir "icon-maskable-192.png") 192 0.78
Save-SquareIcon (Join-Path $iconDir "icon-maskable-512.png") 512 0.78

Save-Ogp (Join-Path $ogDir "site.png") "PERSONAL SITE" "立林 裕太朗" "Applied AI × システム企画・アーキテクチャ" "AI Design / AI数学論 / Practices / Case Studies"
Save-Ogp (Join-Path $ogDir "career.png") "立林 裕太朗" "Career Profile" "Applied AI × システム企画・アーキテクチャ" "CAREER"
Save-Ogp (Join-Path $ogDir "ai-design-foundations.png") "TECHNICAL KNOWLEDGE" "AI Design Foundations" "AIを業務システムへ組み込むための設計知識" "AI Design / AI数学論 / Practices / Case Studies"
