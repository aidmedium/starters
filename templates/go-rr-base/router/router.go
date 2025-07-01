package router

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/redis/go-redis/v9"
)

type Router struct {
	se  *core.ServeEvent
	rdb *redis.Client
}

func NewRouter(se *core.ServeEvent, rdb *redis.Client) *Router {
	return &Router{se: se, rdb: rdb}
}

func (r *Router) RegisterRoutes() {
	_ = r.se.Router.Group("/api").Bind(apis.RequireAuth())

	// api.GET("/calendar", r.getEconomicCalendar)
}
