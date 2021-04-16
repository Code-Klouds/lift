import type { FromSchema, JSONSchema } from "json-schema-to-ts";
import type { Hook, Serverless } from "../types/serverless";

export abstract class Component<N extends string, S extends JSONSchema> {
    protected readonly name: N;
    protected hooks: Record<string, Hook>;
    protected serverless: Serverless;

    getConfiguration(): FromSchema<S> | undefined {
        return ((this.serverless.configurationInput as unknown) as Record<
            N,
            FromSchema<S>
        >)[this.name];
    }

    getName(): N {
        return this.name;
    }

    protected constructor({
        serverless,
        name,
        schema,
    }: {
        serverless: Serverless;
        name: N;
        schema: S;
    }) {
        this.name = name;
        this.serverless = serverless;

        this.serverless.configSchemaHandler.defineTopLevelProperty(
            this.name,
            schema
        );

        this.hooks = {
            "package:compileEvents": this.compile.bind(this),
        };
    }

    abstract compile(): void | Promise<void>;
}