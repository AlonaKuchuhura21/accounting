FROM openjdk:21-jdk-slim
WORKDIR /app
COPY target/accounting-0.0.1-SNAPSHOT.jar main.jar
ENTRYPOINT ["java", "-jar", "main.jar"]
