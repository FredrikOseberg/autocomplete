.PHONY: start-backend start-frontend install-frontend install-backend test-frontend

start-backend:
	cd backend && npm start

start-frontend: 
	cd frontend && npm start

install-frontend:
	cd frontend && npm install

install-backend: 
	cd backend && npm install;

test-frontend:
	cd frontend && CI=true npm test
