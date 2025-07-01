// Package client handles the Pocketbase client embedding
package client

import (
	"embed"
	"io/fs"
)

//go:embed all:build/client
var distDir embed.FS

var DistDirFS, _ = fs.Sub(distDir, "build/client")
