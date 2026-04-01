# Build a Chrome Web Store / Edge Add-ons ZIP (manifest at zip root).
# Filename: windows-settings-shortcuts-v<manifestVersion>.zip  -> ../dist/

$ErrorActionPreference = 'Stop'
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $RepoRoot

$manifestPath = Join-Path $RepoRoot 'manifest.json'
$manifest = Get-Content -Raw $manifestPath | ConvertFrom-Json
$version = $manifest.version
if (-not $version) { throw 'manifest.json missing version' }

$baseName = "windows-settings-shortcuts-v$version"
$distDir = Join-Path $RepoRoot 'dist'
$staging = Join-Path $distDir "staging-$version"
$zipPath = Join-Path $distDir "$baseName.zip"

if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
New-Item -ItemType Directory -Force -Path $staging | Out-Null

Copy-Item (Join-Path $RepoRoot 'manifest.json') $staging
Copy-Item (Join-Path $RepoRoot 'brand') $staging -Recurse
Copy-Item (Join-Path $RepoRoot 'icons') $staging -Recurse
Copy-Item (Join-Path $RepoRoot '_locales') $staging -Recurse
Copy-Item (Join-Path $RepoRoot 'src') $staging -Recurse

if (-not (Test-Path $distDir)) { New-Item -ItemType Directory -Force -Path $distDir | Out-Null }
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Compress-Archive -Path (Join-Path $staging '*') -DestinationPath $zipPath -CompressionLevel Optimal -Force
Remove-Item $staging -Recurse -Force

Write-Host "Created: $zipPath"
Get-Item $zipPath | Select-Object FullName, Length, LastWriteTime
