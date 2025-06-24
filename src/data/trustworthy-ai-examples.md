# Trustworthy AI Code Examples

## Transparency & Explainability

### SHAP Feature Importance

Calculate and visualize SHAP values for model explanations

```python
import shap
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

# Train your model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Create SHAP explainer
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# Visualize feature importance
shap.summary_plot(shap_values[1], X_test, feature_names=feature_names)

# Get feature importance for a single prediction
shap.force_plot(explainer.expected_value[1], shap_values[1][0], X_test.iloc[0])
```

### LIME Local Explanations

Explain individual predictions using LIME

```python
from lime import lime_tabular
import numpy as np

# Create LIME explainer
explainer = lime_tabular.LimeTabularExplainer(
    X_train.values,
    feature_names=feature_names,
    class_names=['Class 0', 'Class 1'],
    mode='classification'
)

# Explain a single instance
instance_idx = 0
explanation = explainer.explain_instance(
    X_test.iloc[instance_idx].values,
    model.predict_proba,
    num_features=10
)

# Show explanation
explanation.show_in_notebook(show_table=True)
```

## Fairness & Non-discrimination

### Demographic Parity Check
Measure demographic parity across protected groups

```python
from fairlearn.metrics import demographic_parity_difference
import pandas as pd

# Calculate demographic parity difference
dp_diff = demographic_parity_difference(
    y_true=y_test,
    y_pred=y_pred,
    sensitive_features=sensitive_features
)

print(f"Demographic Parity Difference: {dp_diff:.3f}")

# Detailed analysis by group
results = pd.DataFrame({
    'Group': sensitive_features.unique(),
    'Positive_Rate': [
        (y_pred[sensitive_features == group] == 1).mean()
        for group in sensitive_features.unique()
    ]
})
print(results)
```

### Fairness Metrics Dashboard

Comprehensive fairness evaluation using Fairlearn

```python
from fairlearn.metrics import MetricFrame
from sklearn.metrics import accuracy_score, precision_score, recall_score

# Create metric frame for comprehensive analysis
metric_frame = MetricFrame(
    metrics={
        'accuracy': accuracy_score,
        'precision': precision_score,
        'recall': recall_score
    },
    y_true=y_test,
    y_pred=y_pred,
    sensitive_features=sensitive_features
)

# Display results
print("Overall metrics:")
print(metric_frame.overall)
print("\nBy group:")
print(metric_frame.by_group)
print("\nDifferences:")
print(metric_frame.difference())
```

## Robustness & Security

### Adversarial Attack Testing
Test model robustness against adversarial examples

```python
from art.attacks.evasion import FastGradientMethod
from art.estimators.classification import SklearnClassifier
import numpy as np

# Wrap your model
classifier = SklearnClassifier(model=model)

# Create adversarial attack
attack = FastGradientMethod(estimator=classifier, eps=0.1)

# Generate adversarial examples
X_test_adv = attack.generate(x=X_test)

# Evaluate robustness
clean_accuracy = model.score(X_test, y_test)
adv_accuracy = model.score(X_test_adv, y_test)

print(f"Clean Accuracy: {clean_accuracy:.3f}")
print(f"Adversarial Accuracy: {adv_accuracy:.3f}")
print(f"Robustness Drop: {clean_accuracy - adv_accuracy:.3f}")
```

## Accountability & Governance

### MLflow Experiment Tracking

Track model experiments and lineage with MLflow

```python
import mlflow
import mlflow.sklearn
from sklearn.metrics import accuracy_score

# Start MLflow run
with mlflow.start_run():
    # Log parameters
    mlflow.log_param("n_estimators", 100)
    mlflow.log_param("max_depth", 10)
    
    # Train model
    model.fit(X_train, y_train)
    
    # Make predictions and calculate metrics
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    # Log metrics
    mlflow.log_metric("accuracy", accuracy)
    
    # Log model
    mlflow.sklearn.log_model(model, "model")
    
    # Log artifacts
    mlflow.log_artifact("feature_importance.png")
```