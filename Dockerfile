# Webpack build
FROM node:14.17.3-stretch AS frontend
WORKDIR /client

COPY ./src/K9OCRS.Client/package.json ./
COPY ./src/K9OCRS.Client/yarn.lock ./

RUN yarn

COPY ./src/K9OCRS.Client ./

RUN yarn build:prod

# NETCORE BUILD
FROM mcr.microsoft.com/dotnet/sdk:3.1.411 AS build
WORKDIR /app

COPY ./*.sln ./
COPY ./src ./src/

RUN dotnet restore
RUN dotnet publish -o /app/build

COPY --from=frontend /client/dist /app/build/wwwroot/dist/

# RUNTIME
FROM mcr.microsoft.com/dotnet/aspnet:3.1.17

# Set Default Time Zone
RUN ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
ENV DOTNET_SHUTDOWNTIMEOUTSECONDS=25

WORKDIR /app

COPY --from=build /app/build ./

RUN chmod +x ./K9OCRS

# ENTRYPOINT ["./IgniteVMS"]
CMD ASPNETCORE_URLS=http://*:$PORT ./K9OCRS