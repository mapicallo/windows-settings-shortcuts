# Chrome Web Store promotional tiles (no alpha):
# - Small: 440 x 280
# - Marquee: 1400 x 560
# Uses "cover" scaling (fills frame, center crop) on a source image (default: extension UI screenshot).

param(
  [string]$SourceDir = "C:\code\pantallazos_settings",
  [string]$SourceFile = "",
  [string]$OutDir = ""
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

if (-not $SourceFile) {
  $candidates = @(
    (Join-Path $SourceDir "4_ux-extension.png"),
    (Join-Path $SourceDir "3_setting_customer.png"),
    (Join-Path $SourceDir "1_setting-energy.png")
  )
  foreach ($c in $candidates) {
    if (Test-Path $c) {
      $SourceFile = $c
      break
    }
  }
  if (-not $SourceFile) {
    throw "No default source found under $SourceDir. Pass -SourceFile path to a PNG/JPEG."
  }
}

if (-not (Test-Path $SourceFile)) {
  throw "Source not found: $SourceFile"
}

if (-not $OutDir) {
  $OutDir = Join-Path $SourceDir "chrome-web-store-promo"
}

function Export-CoverTile {
  param(
    [string]$InputPath,
    [string]$OutputPath,
    [int]$W,
    [int]$H
  )

  $src = [System.Drawing.Image]::FromFile((Resolve-Path $InputPath))
  try {
    $bmp = New-Object System.Drawing.Bitmap $W, $H, ([System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.CompositingMode    = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy

    $scale = [Math]::Max([double]$W / $src.Width, [double]$H / $src.Height)
    $nw = [Math]::Max(1, [int][Math]::Round($src.Width * $scale))
    $nh = [Math]::Max(1, [int][Math]::Round($src.Height * $scale))
    $x = [int](($W - $nw) / 2)
    $y = [int](($H - $nh) / 2)

    $g.DrawImage($src, $x, $y, $nw, $nh)
    $g.Dispose()

    $parent = Split-Path -Parent $OutputPath
    if (-not (Test-Path $parent)) {
      New-Item -ItemType Directory -Force -Path $parent | Out-Null
    }
    $bmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
  }
  finally {
    $src.Dispose()
  }
}

$smallOut  = Join-Path $OutDir "promo-small-440x280.png"
$marqueeOut = Join-Path $OutDir "promo-marquee-1400x560.png"

Export-CoverTile -InputPath $SourceFile -OutputPath $smallOut -W 440 -H 280
Export-CoverTile -InputPath $SourceFile -OutputPath $marqueeOut -W 1400 -H 560

Write-Host "Source: $SourceFile"
Write-Host "Small:    $smallOut"
Write-Host "Marquee: $marqueeOut"
