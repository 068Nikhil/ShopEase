# Stage 1: Build the JAR file
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /workspace

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the smaller runtime image
FROM eclipse-temurin:21-jre

WORKDIR /app

# The JAR is copied to the current directory (/app) in this stage
COPY --from=build /workspace/target/Backend-0.0.1-SNAPSHOT.jar .

EXPOSE 8080

# Reference the file in the current working directory (/app)
ENTRYPOINT ["java", "-jar", "Backend-0.0.1-SNAPSHOT.jar"]