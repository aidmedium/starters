package main

import (
	"chizidotdev/diary/client"
	"chizidotdev/diary/config"
	"chizidotdev/diary/hooks"
	"chizidotdev/diary/router"
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/redis/go-redis/v9"
)

func main() {
	config.LoadConfig()

	opt, err := redis.ParseURL(config.EnvVars.RedisUrl)
	if err != nil {
		panic(err)
	}
	rdb := redis.NewClient(opt)

	app := pocketbase.New()

	hooks.NewHookService(app).Run()

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		// serves static files from the provided public dir (if exists)
		se.Router.GET("/{path...}", apis.Static(client.DistDirFS, true)).Bind(apis.Gzip())
		router.NewRouter(se, rdb).RegisterRoutes()

		return se.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
