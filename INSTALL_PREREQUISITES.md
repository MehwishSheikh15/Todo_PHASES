# ⚠️ Prerequisites Installation Required

## 🔍 Issue Detected

The deployment cannot proceed because the following tools are not installed or not in your PATH:
- ❌ **Minikube** - Not found
- ❌ **kubectl** - Not found  
- ❌ **Helm** - Not found

---

## 📦 Quick Installation Guide (Windows)

### Option 1: Install via Chocolatey (Recommended)

If you have Chocolatey installed:

```powershell
# Run PowerShell as Administrator

# Install Minikube
choco install minikube -y

# Install kubectl
choco install kubernetes-cli -y

# Install Helm
choco install kubernetes-helm -y

# Refresh environment variables
refreshenv
```

### Option 2: Install via Winget

```powershell
# Run PowerShell as Administrator

# Install Minikube
winget install Kubernetes.minikube

# Install kubectl
winget install Kubernetes.kubectl

# Install Helm
winget install Helm.Helm
```

### Option 3: Manual Installation

#### Install Minikube
```powershell
# Download and install
New-Item -Path 'c:\' -Name 'minikube' -ItemType Directory -Force
Invoke-WebRequest -OutFile 'c:\minikube\minikube.exe' -Uri 'https://github.com/kubernetes/minikube/releases/latest/download/minikube-windows-amd64.exe' -UseBasicParsing

# Add to PATH
$oldPath = [Environment]::GetEnvironmentVariable('Path', [EnvironmentVariableTarget]::Machine)
if ($oldPath.Split(';') -inotcontains 'C:\minikube'){
  [Environment]::SetEnvironmentVariable('Path', $('{0};C:\minikube' -f $oldPath), [EnvironmentVariableTarget]::Machine)
}
```

#### Install kubectl
```powershell
# Download kubectl
curl.exe -LO "https://dl.k8s.io/release/v1.28.0/bin/windows/amd64/kubectl.exe"

# Move to a directory in PATH (e.g., C:\Windows\System32)
Move-Item .\kubectl.exe C:\Windows\System32\kubectl.exe -Force
```

#### Install Helm
```powershell
# Download Helm
Invoke-WebRequest -Uri https://get.helm.sh/helm-v3.13.0-windows-amd64.zip -OutFile helm.zip

# Extract
Expand-Archive helm.zip -DestinationPath C:\helm

# Move to PATH
Move-Item C:\helm\windows-amd64\helm.exe C:\Windows\System32\helm.exe -Force
```

---

## ✅ Verify Installation

After installing, **restart your PowerShell** and verify:

```powershell
# Check Minikube
minikube version

# Check kubectl
kubectl version --client

# Check Helm
helm version
```

---

## 🚀 After Installation - Deploy

Once all tools are installed, run:

```powershell
cd C:\Users\BRC\Downloads\PHASE_II
.\deploy-todo-chatbot.bat
```

Or use the one-liner:

```powershell
kubectl delete namespace todo-app --ignore-not-found=true; Start-Sleep 5; kubectl create namespace todo-app; minikube image load todo-frontend:latest; minikube image load todo-backend:latest; helm install todo-chatbot .\todo-chatbot -n todo-app; kubectl get all -n todo-app
```

---

## 🐳 Alternative: Docker Desktop with Kubernetes

If you have Docker Desktop installed, you can enable Kubernetes instead of Minikube:

1. Open Docker Desktop
2. Go to Settings → Kubernetes
3. Check "Enable Kubernetes"
4. Click "Apply & Restart"

Then use kubectl and helm directly without Minikube.

---

## 📋 Installation Checklist

- [ ] Install Chocolatey (if not already installed)
- [ ] Install Minikube
- [ ] Install kubectl
- [ ] Install Helm
- [ ] Restart PowerShell
- [ ] Verify all tools are working
- [ ] Start Minikube: `minikube start --driver=docker`
- [ ] Run deployment script

---

## 🔗 Official Documentation

- **Minikube**: https://minikube.sigs.k8s.io/docs/start/
- **kubectl**: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
- **Helm**: https://helm.sh/docs/intro/install/
- **Chocolatey**: https://chocolatey.org/install

---

## 💡 Quick Start After Installation

```powershell
# 1. Start Minikube
minikube start --driver=docker

# 2. Verify Minikube is running
minikube status

# 3. Deploy Todo Chatbot
cd C:\Users\BRC\Downloads\PHASE_II
.\deploy-todo-chatbot.bat

# 4. Get access URL
$ip = minikube ip
Write-Host "Access at: http://$ip:30080"
```
