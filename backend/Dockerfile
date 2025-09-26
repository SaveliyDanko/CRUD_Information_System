FROM gradle:8.14-jdk17-alpine AS build
WORKDIR /app

COPY gradlew .
COPY gradle gradle

COPY settings.gradle .
COPY build.gradle .

RUN --mount=type=cache,target=/home/gradle/.gradle \
    ./gradlew -g /home/gradle/.gradle --no-daemon \
      -Dorg.gradle.caching=true \
      -Dorg.gradle.parallel=true \
      tasks || true

COPY src ./src
RUN --mount=type=cache,target=/home/gradle/.gradle \
    ./gradlew -g /home/gradle/.gradle --no-daemon \
      -Dorg.gradle.caching=true \
      -Dorg.gradle.parallel=true \
      clean bootJar

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app
USER app

COPY --from=build /app/build/libs/*.jar /app/app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
