# Generates PNG toolbar icons: gear (settings) on Windows-style blue.
# Requires .NET / System.Drawing (Windows).

param(
  [string]$OutDir = (Join-Path $PSScriptRoot "..\icons")
)

Add-Type -AssemblyName System.Drawing

function New-GearPath([float]$cx, [float]$cy, [float]$outerR, [float]$innerR, [int]$teeth) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $n = $teeth * 2
  $pts = New-Object System.Drawing.PointF[] $n
  $dTheta = [Math]::PI / $teeth
  for ($i = 0; $i -lt $n; $i++) {
    $a = $i * $dTheta - [Math]::PI / 2
    $r = if (($i % 2) -eq 0) { $outerR } else { $innerR }
    $pts[$i] = [System.Drawing.PointF]::new(
      ($cx + $r * [Math]::Cos($a)),
      ($cy + $r * [Math]::Sin($a))
    )
  }
  $path.AddPolygon($pts)
  return $path
}

function Write-IconPng([int]$size, [string]$path) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  # Background — Windows accent blue with subtle corner radius feel (filled circle for tiny sizes)
  $bg = [System.Drawing.Color]::FromArgb(255, 0, 120, 212)
  $brushBg = New-Object System.Drawing.SolidBrush $bg
  $pad = [Math]::Max(1, [int]($size * 0.06))
  $g.FillEllipse($brushBg, $pad, $pad, $size - 2 * $pad, $size - 2 * $pad)
  $brushBg.Dispose()

  $cx = $size / 2.0
  $cy = $size / 2.0
  $scale = $size / 128.0
  $outer = 38 * $scale
  $inner = 24 * $scale
  $hole = 14 * $scale
  if ($size -le 16) {
    $outer = 5.2
    $inner = 3.2
    $hole = 1.8
  } elseif ($size -le 32) {
    $outer = 9.8
    $inner = 6.0
    $hole = 3.4
  } elseif ($size -le 48) {
    $outer = 14.5
    $inner = 9.0
    $hole = 5.0
  }

  $gearPath = New-GearPath $cx $cy $outer $inner 8
  $white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
  # Light inner shadow for depth at larger sizes
  if ($size -ge 48) {
    $shadow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(40, 0, 0, 0))
    $gearPathShadow = New-GearPath ($cx + 0.5) ($cy + 0.5) $outer $inner 8
    $g.FillPath($shadow, $gearPathShadow)
    $gearPathShadow.Dispose()
    $shadow.Dispose()
  }
  $g.FillPath($white, $gearPath)
  $gearPath.Dispose()
  $white.Dispose()

  # Center hole (knock out to show blue again = cog look)
  $holeBrush = New-Object System.Drawing.SolidBrush $bg
  $holeR = $hole / 2
  $g.FillEllipse($holeBrush, $cx - $holeR, $cy - $holeR, $hole, $hole)
  $holeBrush.Dispose()

  $g.Dispose()
  $dir = Split-Path $path -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

$OutDir = Resolve-Path $OutDir -ErrorAction SilentlyContinue
if (-not $OutDir) { $OutDir = Join-Path $PSScriptRoot "..\icons"; New-Item -ItemType Directory -Force -Path $OutDir | Out-Null }

foreach ($s in @(16, 32, 48, 128)) {
  Write-IconPng $s (Join-Path $OutDir "icon$s.png")
}

Write-Host "Wrote icons to $OutDir"
