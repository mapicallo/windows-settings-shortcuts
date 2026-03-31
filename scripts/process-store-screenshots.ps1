# Resize screenshots to Chrome Web Store specs: 1280×800 OR 640×400, PNG/C24 JPEG, no alpha.
# Default: 1280×800, PNG from 24bpp RGB bitmap (no transparency).

param(
  [string]$SourceDir = "C:\code\pantallazos_settings",
  [string]$OutDir = "",
  [ValidateSet(1280, 640)]
  [int]$Width = 1280
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$Height = if ($Width -eq 1280) { 800 } else { 400 }

if (-not $OutDir) {
  $OutDir = Join-Path $SourceDir "chrome-web-store-$Width`x$Height"
}

function Export-StoreShot {
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
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy

    $bg = [System.Drawing.Color]::FromArgb(255, 246, 248, 252)
    $g.Clear($bg)

    $scale = [Math]::Min([double]$W / $src.Width, [double]$H / $src.Height)
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

$files = Get-ChildItem -Path $SourceDir -File -ErrorAction Stop |
  Where-Object { $_.Extension -match '\.(png|jpg|jpeg)$' } |
  Sort-Object Name

if ($files.Count -eq 0) {
  throw "No PNG/JPEG files in: $SourceDir"
}

$i = 0
foreach ($f in $files) {
  $i++
  $base = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
  $outName = "{0:D2}-{1}-{2}x{3}.png" -f $i, $base, $Width, $Height
  $outPath = Join-Path $OutDir $outName
  Export-StoreShot -InputPath $f.FullName -OutputPath $outPath -W $Width -H $Height
  Write-Host "OK $outPath"
}

Write-Host "`nOutput folder: $OutDir ($($files.Count) images, ${Width}x${Height}, PNG RGB)"
