# kyma-serverless-function

Here you will see how to deploy your serverless function to SAP BTP, Kyma Enviroment.
One will be for public repositories and the another will be for private repositories using kubectl commands.

## Deploy a public repository without authentication:

```jsx
apiVersion: serverless.kyma-project.io/v1alpha2
kind: Function
metadata:
  name: name-of-your-function
  namespace: name-of-your-namespace
spec:
  runtime: nodejs16
  source:
    gitRepository:
      baseDir: /functions
      reference: master
      url: https://github.com/ericcarickli/kyma-serverless-function.git
```

## Deploy private repositories using SSH Key authentication:

1. Create a secret in your Kyma Runtime:

To generate a create secret kubectl command using your PRIV_KEY you can run the following command:

```jsx
kubectl create secret generic name-of-your-secret --from-literal=key="SSH_PRIV_KEY" -o yaml --dry-run=client
``` 

The previous command will generate a code like this:

```jsx
apiVersion: v1
data:
  key: your-encrypted-ssh-key
kind: Secret
metadata:
  name: name-of-your-secret
``` 

2. Create your function in Kyma Runtime:

```jsx
apiVersion: serverless.kyma-project.io/v1alpha2
kind: Function
metadata:
  name: name-of-your-function
  namespace: name-of-your-namespace
spec:
  runtime: nodejs16
  source:
    gitRepository:
      url: git@github.com:ericcarickli/kyma-serverless-function.git
      baseDir: /functions
      reference: master
      auth:
        type: key
        secretName: name-of-your-secret
```

3. Create API Rule to expose your serverless function for http access:

```jsx
apiVersion: gateway.kyma-project.io/v1beta1
kind: APIRule
metadata:
  name: name-of-your-function-api
  labels:
    app.kubernetes.io/name: name-of-your-function-api
  annotations: {}
  namespace: default
spec:
  gateway: kyma-gateway.kyma-system.svc.cluster.local
  rules:
    - path: /.*
      methods:
        - GET
      accessStrategies:
        - handler: allow
  service:
    name: name-of-your-function
    port: 80
  host: name-of-your-function-api.a217eee.kyma.ondemand.com
```
Now your able to access your serverless function running in the url:
```jsx
https://name-of-your-function-api.a217eee.kyma.ondemand.com
```

## All this commands can be executed in two ways:

a. Adding it to a .yaml file and running it with the command:
```jsx
kubectl apply -n default -f your-file.yaml --kubeconfig ~/.kube/kubeconfig.yaml
```

b. Running it inside of a ``cat <<EOF | EOF``, for example:
```jsx
cat <<EOF | kubectl apply --kubeconfig ~/.kube/kubeconfig.yaml -f -
apiVersion: v1
data:
  key: your-encrypted-ssh-key
kind: Secret
metadata:
  name: name-of-your-secret
EOF
```

To connect your local kubectl to your Kyma Runtime environment you can follow the steps in this link https://developers.sap.com/tutorials/cp-kyma-download-cli.html.
