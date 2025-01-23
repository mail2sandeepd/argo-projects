# Node.js Application Deployment with ArgoCD

This repository contains a Helm chart for deploying a Node.js application to Kubernetes/OpenShift clusters using ArgoCD, along with automated CI/CD using GitHub Actions.

## Prerequisites

Before you begin, ensure you have the following:

1. Access to a Kubernetes/OpenShift cluster
2. ArgoCD installed on the cluster
3. Access to GitHub repository
4. Docker Hub account (for container registry)
5. `kubectl` or `oc` CLI tool installed
6. Python 3.x installed (for load testing)

## Repository Structure

```
.
├── helm/                    # Helm chart for application deployment
│   ├── templates/          # Kubernetes manifest templates
│   │   ├── deployment.yaml # Main application deployment
│   │   ├── service.yaml    # Service configuration
│   │   ├── ingress.yaml   # Ingress configuration
│   │   ├── route.yaml     # OpenShift route configuration
│   │   ├── hpa.yaml       # Horizontal Pod Autoscaler
│   │   ├── namespace.yaml # Namespace definition
│   │   ├── limitrange.yaml# Default container limits
│   │   └── resourcequota.yaml # Namespace resource quotas
│   ├── Chart.yaml         # Helm chart metadata
│   └── values.yaml        # Default configuration values
├── helm-app/              # Application source code
│   └── app/              # Node.js application
│       ├── Dockerfile    # Container image definition
│       ├── app.js        # Application code
│       └── package.json  # Node.js dependencies
├── .github/
│   └── workflows/        # GitHub Actions workflows
│       └── cd.yml       # Continuous Deployment pipeline
└── load-test.py         # Load testing script
```

## GitHub Actions CI/CD Pipeline

The repository includes an automated CI/CD pipeline (`cd.yml`) that:
1. Triggers on push to main branch
2. Builds Docker image with incremented version
3. Pushes the image to Docker Hub
4. Updates the Helm chart's values.yaml with new version
5. Commits and pushes the changes back to the repository

Required GitHub Secrets:
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_KEY`: Your Docker Hub access token

## Helm Chart Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/argo-projects.git
   cd argo-projects
   ```

2. Configure values in `helm/values.yaml`:
   ```yaml
   env:
     APP_VERSION: "v1"        # Managed by CD pipeline
     NAME: "TCS - BFSI CoE"
     REPLICAS: 3
     NAMESPACE: "sd-demo"
     APP_NAME: "app"
     APP_HOSTNAME: "sd-demo-application.io"
   service:
     port: 3000
   ```

3. Install using Helm:
   ```bash
   helm install your-release-name ./helm -n sd-demo
   ```

## ArgoCD Setup

1. Create an ArgoCD Application:
   ```yaml
   apiVersion: argoproj.io/v1alpha1
   kind: Application
   metadata:
     name: sd-demo
     namespace: argocd
   spec:
     project: default
     source:
       repoURL: https://github.com/your-username/argo-projects.git
       path: helm
       targetRevision: HEAD
     destination:
       server: https://kubernetes.default.svc
       namespace: sd-demo
     syncPolicy:
       automated:
         prune: true
         selfHeal: true
   ```

## Application Features

- Automatic horizontal pod autoscaling (HPA)
  - CPU threshold: 70%
  - Memory threshold: 80%
- Resource quotas and limits per namespace
- Ingress/Route configuration for both Kubernetes and OpenShift
- Namespace isolation with resource constraints
- Health checks and probes
- Automated version management
- GitOps-based deployment

## Load Testing

The repository includes a Python script for load testing:

1. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the load test:
   ```bash
   python load-test.py --url http://your-app-hostname \
                      --requests 1000 \
                      --users 20 \
                      --duration 300
   ```

   Parameters:
   - `--url`: Your application URL
   - `--requests`: Total number of requests (default: 1000)
   - `--users`: Concurrent users (default: 10)
   - `--duration`: Test duration in seconds (default: 300)

3. Monitor HPA scaling:
   ```bash
   kubectl get hpa -n sd-demo -w
   ```

## Monitoring and Debugging

1. Check pod status:
   ```bash
   kubectl get pods -n sd-demo
   ```

2. View pod logs:
   ```bash
   kubectl logs -f deployment/app-deploy -n sd-demo
   ```

3. Check HPA status:
   ```bash
   kubectl describe hpa app-hpa -n sd-demo
   ```

4. Monitor resource usage:
   ```bash
   kubectl top pods -n sd-demo
   ```

## Development

To make changes to the application:

1. Modify the Node.js application in `helm-app/app/`
2. Push changes to the main branch
3. GitHub Actions will automatically:
   - Build new Docker image
   - Increment version
   - Update Helm chart
   - Trigger ArgoCD sync

## Support

For issues and feature requests, please create an issue in the GitHub repository.
