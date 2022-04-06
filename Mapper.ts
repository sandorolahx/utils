// mapper usage:
// const mapper = new Mapper();
// const result = mapper.map(entity, 'EntityDst');

type DestinationType = 'EntitySrc' | 'EntityDst';

export class Mapper {
    map<TSource>(source: TSource, destinationType: DestinationType) {
        const key = source?.constructor?.name + '_' + destinationType;
        switch (key) {
            case EntitySrc.name + '_EntityDst':
                return new Mapper_EntitySrc_EntityDst().map(source as unknown as EntityDst);
            default:
                throw new Error(`Cannot find mapper : ${key}`);
        }
    }
}

interface IMapper<TSource, TDestination> {
    map(source: TSource): TDestination;
}

class Mapper_EntitySrc_EntityDst implements IMapper<EntitySrc, EntityDst> {
    map(source: EntitySrc): EntityDst {
        const destination = new EntityDst();
        const mapper = new MapMember(source, destination);

        return mapper
            .forMember('propDst', (item) => item.propSrc)
            .map();
    }
}

class MapMember<TSource, TDestination> {
    private _source: TSource;
    private _destination: TDestination;

    constructor(source: TSource, dst: TDestination) {
        this._source = source;
        this._destination = dst;
    }

    forMember(destinationKey: keyof TDestination, source: (item: TSource) => any) {
        this._destination[destinationKey] = source(this._source);
        return this;
    };

    map() {
        return this._destination;
    }
}
