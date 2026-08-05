from aws_cdk import (
    Stack,
    CfnOutput,
    aws_amplify as amplify,
)
from constructs import Construct


class AmplifyHostingStack(Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        api_url: str,
        **kwargs
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        app = amplify.CfnApp(
            self,
            "FrontendAmplifyApp",
            name="image-optimization-frontend",
            platform="WEB",
            enable_branch_auto_deletion=False,
            environment_variables=[
                amplify.CfnApp.EnvironmentVariableProperty(
                    name="VITE_API_GATEWAY_URL",
                    value=api_url.rstrip("/")
                ),
                amplify.CfnApp.EnvironmentVariableProperty(
                    name="VITE_GOOGLE_CLIENT_ID",
                    value="{{resolve:secretsmanager:amplify/google-client-id:SecretString}}"
                ),
            ],
            build_spec="""version: 1
applications:
  - appRoot: frontend/image-optimization-system/image-optimization-frontend
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: dist
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
""",
            custom_rules=[
                amplify.CfnApp.CustomRuleProperty(
                    source="</^[^.]+$|\\.(?!(css|gif|ico|jpg|jpeg|js|png|svg|txt|webp|woff|woff2)$)([^.]+$)/>",
                    target="/index.html",
                    status="200",
                )
            ],
        )

        branch = amplify.CfnBranch(
            self,
            "MainBranch",
            app_id=app.attr_app_id,
            branch_name="main",
            stage="PRODUCTION",
            enable_auto_build=False,
        )

        CfnOutput(
            self,
            "AmplifyAppId",
            value=app.attr_app_id,
            description="Amplify app ID for the frontend",
        )

        CfnOutput(
            self,
            "FrontendUrl",
            value=f"https://{branch.branch_name}.{app.attr_default_domain}",
            description="Amplify HTTPS URL for the frontend",
        )
