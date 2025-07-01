package hooks

import (
	"github.com/pocketbase/pocketbase"
)

type Service struct {
	app *pocketbase.PocketBase
}

func NewHookService(app *pocketbase.PocketBase) *Service {
	return &Service{app: app}
}

func (h *Service) Run() {
	// Accounts
	// h.app.OnRecordUpdate(types.CollectionAccounts).BindFunc(h.onAccountRecordUpdate)
}
