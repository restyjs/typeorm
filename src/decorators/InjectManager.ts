// The MIT License

// Copyright (c) 2015-2020 Yakdu. http://typeorm.github.io

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import { ConnectionManager } from "typeorm";
import { Container } from "typedi";

/**
 * Allows to inject an EntityManager using typedi's Container.
 */
export function InjectManager(connectionName: string = "default"): Function {
  return function (
    object: Object | Function,
    propertyName: string,
    index?: number
  ) {
    Container.registerHandler({
      object,
      index,
      propertyName,
      value: () => {
        const connectionManager = Container.get(ConnectionManager);
        if (!connectionManager.has(connectionName))
          throw new Error(
            `Cannot get connection "${connectionName}" from the connection manager. ` +
              `Make sure you have created such connection. Also make sure you have called useContainer(Container) ` +
              `in your application before you established a connection and importing any entity.`
          );

        const connection = connectionManager.get(connectionName);
        const entityManager = connection.manager;
        if (!entityManager)
          throw new Error(
            `Entity manager was not found on "${connectionName}" connection. ` +
              `Make sure you correctly setup connection and container usage.`
          );

        return entityManager;
      },
    });
  };
}
