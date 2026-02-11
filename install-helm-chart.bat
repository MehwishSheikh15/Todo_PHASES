@echo off
REM Script to install the Todo Chatbot Helm chart

echo Installing Todo Chatbot using Helm...

REM Add the namespace if it doesn't exist
kubectl create namespace todo-chatbot --dry-run=client -o yaml | kubectl apply -f -

REM Install the Helm chart
helm install todo-chatbot ./helm/todo-chatbot --namespace todo-chatbot --values ./helm/todo-chatbot/values.yaml

echo Helm chart installation complete!
echo To check the status of your release, run: helm status todo-chatbot
echo To see the pods, run: kubectl get pods -n todo-chatbot