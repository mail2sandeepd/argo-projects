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
4. Automatically cleans up old Docker images (keeps only last 2 versions)
5. Updates the Helm chart's values.yaml with new version
6. Commits and pushes the changes back to the repository

### Docker Image Management

The CI/CD pipeline includes automatic cleanup of Docker images:
- Only the latest 2 versions of the image are retained
- Older versions are automatically deleted from Docker Hub
- This helps maintain a clean repository and reduces storage usage
- Version numbering follows the format: `v1`, `v2`, etc.

### Version History

To check available versions:
```bash
# List available image tags
docker images mail2sandeepd/app-helm --format "{{.Tag}}"

# Pull specific version
docker pull mail2sandeepd/app-helm:v2

# Check image details
docker inspect mail2sandeepd/app-helm:v2
```

Required GitHub Secrets:
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_KEY`: Your Docker Hub access token (with delete permissions)

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
- OpenShift Console Integration
  - Custom application link in OpenShift console
  - Configurable link text and section
  - Custom application icon

## OpenShift Console Integration

The application includes OpenShift console integration through ConsoleLink:

1. Configuration in values.yaml:
   ```yaml
   console:
     text: "Demo Application - OpenShift"    # Link text in console
     section: "Demo Application SD"          # Section in application menu
     imageURL: "your-icon-url"              # Application icon URL
   ```

2. Features:
   - Adds a direct link to your application in OpenShift console
   - Appears in the Application Menu for easy access
   - Customizable icon and text
   - Automatically deployed with Helm chart

3. Access:
   - Open OpenShift Web Console
   - Look for your application link in the Application Menu
   - Click to directly access your application

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

### Using kubectl (Kubernetes)

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

5. Port forwarding to local machine:
   ```bash
   kubectl port-forward svc/app-service 8080:3000 -n sd-demo
   ```

6. Check events:
   ```bash
   kubectl get events -n sd-demo
   ```

7. Describe deployment:
   ```bash
   kubectl describe deployment app-deploy -n sd-demo
   ```

### Using oc (OpenShift)

1. Check pod status:
   ```bash
   oc get pods -n sd-demo
   ```

2. View pod logs:
   ```bash
   oc logs -f deployment/app-deploy -n sd-demo
   ```

3. Check HPA status:
   ```bash
   oc describe hpa app-hpa -n sd-demo
   ```

4. Monitor resource usage:
   ```bash
   oc adm top pods -n sd-demo
   ```

5. Port forwarding to local machine:
   ```bash
   oc port-forward svc/app-service 8080:3000 -n sd-demo
   ```

6. Check events:
   ```bash
   oc get events -n sd-demo
   ```

7. Describe deployment:
   ```bash
   oc describe deployment app-deploy -n sd-demo
   ```

8. OpenShift specific commands:
   ```bash
   # Get route URL
   oc get route app-route -n sd-demo -o jsonpath='{.spec.host}'

   # Check build status
   oc get builds -n sd-demo

   # View build logs
   oc logs -f bc/app-build -n sd-demo

   # Get OpenShift console URL
   oc whoami --show-console

   # Get cluster version
   oc version

   # Check cluster status
   oc get clusterversion
   oc get clusteroperators
   ```

### Common Troubleshooting Commands (Both Platforms)

1. Check resource quotas:
   ```bash
   # Kubernetes
   kubectl describe resourcequota -n sd-demo

   # OpenShift
   oc describe resourcequota -n sd-demo
   ```

2. Check limit ranges:
   ```bash
   # Kubernetes
   kubectl describe limitrange -n sd-demo

   # OpenShift
   oc describe limitrange -n sd-demo
   ```

3. Get all resources in namespace:
   ```bash
   # Kubernetes
   kubectl get all -n sd-demo

   # OpenShift
   oc get all -n sd-demo
   ```

4. Execute command in pod:
   ```bash
   # Kubernetes
   kubectl exec -it <pod-name> -n sd-demo -- /bin/sh

   # OpenShift
   oc rsh <pod-name> -n sd-demo
   ```

5. Copy files to/from pod:
   ```bash
   # Kubernetes
   kubectl cp <pod-name>:/path/to/file ./local/path -n sd-demo

   # OpenShift
   oc rsync <pod-name>:/path/to/file ./local/path -n sd-demo
   ```

### Security Context Commands

1. Check security context constraints (OpenShift only):
   ```bash
   oc get scc
   oc describe scc restricted
   ```

2. Check pod security policies (Kubernetes):
   ```bash
   kubectl get psp
   kubectl describe psp restricted
   ```

## Application Access

The application can be accessed through multiple methods:

### OpenShift Route (HTTPS)
The application is exposed via OpenShift Route with HTTPS:
```yaml
# Route Configuration (values.yaml)
env:
  ROUTE_HOSTNAME: "sd-demo-route-application.io"

# Route specification
spec:
  host: {{ .Values.env.ROUTE_HOSTNAME }}
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Redirect
```

Access URL: `https://sd-demo-route-application.io`

### Kubernetes/OpenShift Ingress (HTTP)
The application is also accessible via Ingress:
```yaml
# Ingress Configuration (values.yaml)
env:
  INGRESS_HOSTNAME: "sd-demo-ingress-application.io"

ingress:
  enabled: true
  name: "sd-demo-k8s-ingress"
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    kubernetes.io/ingress.class: "nginx"
```

Access URL: `http://sd-demo-ingress-application.io`

### Verifying Access

1. OpenShift Route:
   ```bash
   # Get route URL
   oc get route app-route -o jsonpath='{.spec.host}'
   
   # Test HTTPS access
   curl -k https://sd-demo-route-application.io
   ```

2. Ingress:
   ```bash
   # Get ingress URL
   kubectl get ingress sd-demo-k8s-ingress -n sd-demo -o jsonpath='{.spec.rules[0].host}'
   
   # Test HTTP access
   curl http://sd-demo-ingress-application.io
   ```

### DNS Configuration
Make sure to configure your DNS or local hosts file to point both hostnames to your cluster:
```bash
# Example /etc/hosts entries
<cluster-ip> sd-demo-route-application.io
<cluster-ip> sd-demo-ingress-application.io
```

### Access Methods Summary
- **Route Access**: `https://sd-demo-route-application.io` (HTTPS)
- **Ingress Access**: `http://sd-demo-ingress-application.io` (HTTP)
- **Console Access**: Available through OpenShift Console Link

## HTTPS Configuration

The application supports HTTPS through both OpenShift Routes and Kubernetes Ingress:

### OpenShift Route (TLS Edge Termination)

The application automatically configures OpenShift routes with edge TLS termination:
```yaml
# Values configuration
openshift:
  enabled: true  # Enables OpenShift-specific resources

# Route configuration (automatic)
spec:
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Redirect
```

Benefits:
- Automatic TLS termination at the router
- HTTP to HTTPS redirection
- No manual certificate management required
- Integrated with OpenShift's built-in certificate management

### Kubernetes Ingress (TLS)

For Kubernetes environments, the application uses Ingress with TLS:

1. Create TLS Secret:
   ```bash
   # Generate self-signed certificate (for development)
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout tls.key -out tls.crt \
     -subj "/CN=sd-demo-application.io"

   # Create Kubernetes secret
   kubectl create secret tls sd-demo-tls \
     --cert=tls.crt \
     --key=tls.key \
     -n sd-demo
   ```

2. Configuration in values.yaml:
   ```yaml
   ingress:
     enabled: true
     name: "sd-demo-ingress"
     annotations:
       nginx.ingress.kubernetes.io/ssl-redirect: "true"
       nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
       nginx.ingress.kubernetes.io/ssl-passthrough: "true"
     tls:
       enabled: true
       secretName: "sd-demo-tls"
   ```

### Additional TLS Options

1. **Let's Encrypt Integration**:
   ```yaml
   annotations:
     cert-manager.io/cluster-issuer: "letsencrypt-prod"
     kubernetes.io/tls-acme: "true"
   ```

2. **Custom Certificate Management**:
   - Using HashiCorp Vault for certificate management
   - Integration with corporate PKI infrastructure
   - Certificate rotation automation

3. **Advanced Security Options**:
   ```yaml
   annotations:
     nginx.ingress.kubernetes.io/ssl-ciphers: "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384"
     nginx.ingress.kubernetes.io/ssl-protocols: "TLSv1.2 TLSv1.3"
     nginx.ingress.kubernetes.io/hsts: "true"
     nginx.ingress.kubernetes.io/hsts-max-age: "31536000"
   ```

### Verifying HTTPS Configuration

1. OpenShift Route:
   ```bash
   # Check route configuration
   oc get route app-route -o yaml
   
   # Test HTTPS access
   curl -k https://sd-demo-route-application.io
   ```

2. Kubernetes Ingress:
   ```bash
   # Check ingress configuration
   kubectl get ingress sd-demo-ingress -n sd-demo
   
   # Check TLS secret
   kubectl get secret sd-demo-tls -n sd-demo
   
   # Test HTTPS access
   curl -k https://sd-demo-application.io
   ```

### Troubleshooting HTTPS

1. Certificate Issues:
   ```bash
   # Check certificate validity
   openssl s_client -connect sd-demo-application.io:443 -servername sd-demo-application.io
   
   # View certificate details
   echo | openssl s_client -servername sd-demo-application.io \
     -connect sd-demo-application.io:443 2>/dev/null | openssl x509 -text
   ```

2. Common Issues:
   - Certificate not trusted: Add CA certificate to trusted roots
   - Certificate mismatch: Ensure hostname matches certificate CN/SAN
   - TLS handshake failure: Check TLS version compatibility

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

## Application Stack Overview

### 1. Application Components
- **Backend**: Node.js Express application
- **Container**: Docker-based containerization
- **Orchestration**: Kubernetes/OpenShift
- **Package Management**: Helm Chart
- **CI/CD**: GitHub Actions with ArgoCD
- **Access Methods**: OpenShift Route (HTTPS) and Kubernetes Ingress (HTTP)

### 2. Directory Structure
```
.
├── helm-app/                      # Application source code
│   └── app/
│       ├── app.js                 # Main application file
│       ├── Dockerfile            # Container build instructions
│       ├── package.json          # Node.js dependencies
│       └── sd-logo.png           # Application logo
├── helm/                         # Helm chart configuration
│   ├── Chart.yaml               # Chart metadata
│   ├── values.yaml              # Configuration values
│   └── templates/               # Kubernetes/OpenShift templates
│       ├── deployment.yaml      # Pod deployment configuration
│       ├── service.yaml         # Service configuration
│       ├── route.yaml           # OpenShift route (HTTPS)
│       ├── ingress.yaml         # Kubernetes ingress (HTTP)
│       ├── hpa.yaml             # Horizontal Pod Autoscaler
│       └── consolelink.yaml     # OpenShift console integration
└── .github/
    └── workflows/
        └── cd.yaml              # CI/CD pipeline configuration
```

### 3. Application Configuration

#### Environment Variables
```yaml
env:
  APP_VERSION: "v12"              # Application version
  NAME: "Folks"                   # Application name
  NAMESPACE: "sd-demo"            # Kubernetes namespace
  APP_NAME: "app"                 # Component name
  # Access Configuration
  ROUTE_HOSTNAME: "sd-demo-route-application.io"     # HTTPS access
  INGRESS_HOSTNAME: "sd-demo-ingress-application.io" # HTTP access
  APP_HOSTNAME: "sd-demo-route-application.io"       # Default hostname
```

#### Resource Management
```yaml
resources:
  requests:
    cpu: "200m"
    memory: "256Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"
```

### 4. Access Methods

#### OpenShift Route (HTTPS)
- **URL**: https://sd-demo-route-application.io
- **Features**:
  - Edge TLS termination
  - Automatic HTTP to HTTPS redirect
  - Integrated with OpenShift console

#### Kubernetes Ingress (HTTP)
- **URL**: http://sd-demo-ingress-application.io
- **Features**:
  - Standard HTTP access
  - Nginx ingress controller
  - Works on both Kubernetes and OpenShift

### 5. CI/CD Pipeline

#### GitHub Actions Workflow
1. **Build Stage**:
   - Builds Docker image
   - Increments version
   - Pushes to Docker Hub

2. **Cleanup Stage**:
   - Maintains only last 2 versions
   - Automatically removes old images

3. **Deploy Stage**:
   - Updates Helm values
   - Commits changes
   - Triggers ArgoCD sync

### 6. Monitoring and Scaling

#### Health Checks
```yaml
probes:
  readiness:
    initialDelaySeconds: 10
    periodSeconds: 10
  liveness:
    initialDelaySeconds: 10
    periodSeconds: 10
```

#### Auto-scaling
- HPA configured for CPU-based scaling
- Min replicas: {{ .Values.env.REPLICAS }}
- Max replicas: {{ .Values.env.MAX_REPLICAS }}

### 7. Security Features

#### OpenShift Route
- HTTPS with edge termination
- Automatic certificate management
- Secure console integration

#### Access Control
- Namespace isolation
- Resource quotas
- Network policies (if configured)

### 8. Development Workflow

1. **Local Development**:
   ```bash
   # Start local development
   cd helm-app/app
   npm install
   npm run dev
   ```

2. **Testing Changes**:
   ```bash
   # Build and test locally
   docker build -t app-helm:local .
   docker run -p 3000:3000 app-helm:local
   ```

3. **Deployment**:
   ```bash
   # Push changes to main branch
   git push origin main
   
   # Watch deployment
   oc get pods -w -n sd-demo
   ```

### 9. Verification Commands

#### OpenShift Route
```bash
# Get route URL
oc get route app-route -o jsonpath='{.spec.host}'

# Test HTTPS access
curl -k https://sd-demo-route-application.io
```

#### Kubernetes Ingress
```bash
# Get ingress URL
kubectl get ingress sd-demo-k8s-ingress -n sd-demo

# Test HTTP access
curl http://sd-demo-ingress-application.io
```

### 10. Maintenance Tasks

1. **Version Management**:
   - Latest versions in Docker Hub
   - Version history in values.yaml
   - Automatic cleanup of old versions

2. **Resource Monitoring**:
   ```bash
   # Check resource usage
   oc adm top pods -n sd-demo
   
   # View application logs
   oc logs -f deployment/app-deploy -n sd-demo
   ```

3. **Scaling**:
   ```bash
   # Manual scaling
   oc scale deployment/app-deploy --replicas=5 -n sd-demo
   
   # Check HPA status
   oc get hpa -n sd-demo
   ```

4. **Troubleshooting**:
   ```bash
   # Check events
   oc get events -n sd-demo
   
   # Debug pod
   oc debug deployment/app-deploy -n sd-demo
   ```

### 11. DNS Configuration
Configure your DNS or local hosts file:
```bash
# /etc/hosts
<cluster-ip> sd-demo-route-application.io
<cluster-ip> sd-demo-ingress-application.io
