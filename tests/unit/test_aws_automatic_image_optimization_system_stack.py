import aws_cdk as core
import aws_cdk.assertions as assertions

from aws_automatic_image_optimization_system.aws_automatic_image_optimization_system_stack import AwsAutomaticImageOptimizationSystemStack

# example tests. To run these tests, uncomment this file along with the example
# resource in aws_automatic_image_optimization_system/aws_automatic_image_optimization_system_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = AwsAutomaticImageOptimizationSystemStack(app, "aws-automatic-image-optimization-system")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
