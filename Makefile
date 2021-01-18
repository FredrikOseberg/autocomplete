.PHONY: start-server start-frontend install-frontend install-backend

start-server:
	cd backend && npm start

start-frontend: 
	cd frontend && npm start

install-frontend:
	cd frontend && npm install

install-backend: 
	cd backend && install backend;