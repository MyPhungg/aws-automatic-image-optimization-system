# Build stage
FROM public.ecr.aws/docker/library/maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build application
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage - Using JRE 21 and AWS Lambda Web Adapter
FROM public.ecr.aws/docker/library/eclipse-temurin:21-jre

# Install AWS Lambda Web Adapter extension
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter

WORKDIR /app

# Copy the built jar
COPY --from=builder /app/target/*.jar app.jar

# Lambda Web Adapter listens on port 8080 by default to proxy to the app
ENV PORT=8080
EXPOSE 8080

# For spring boot, we might want to specify standard production profiles or options
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-XX:TieredStopAtLevel=1 -noverify -Xms256m -Xmx256m"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
