if lsof -Pi :3007 -sTCP:LISTEN
  then
    echo "3007 is running"
else
    node /home/ingage/github/rk-jira_kanban/kanban-server/server.js
    echo "start 3007"
fi