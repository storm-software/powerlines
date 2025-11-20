@0xa56c61324b9d6e49;

enum FileType {
    normal @0;
    builtin @1;
    entry @2;
    chunk @3;
    prebuilt @4;
    asset @5;
}

enum PreserveSignatureType {
    strict @0;
    allowExtension @1;
    exportsOnly @2;
}

# Additional metadata associated with a file in the file system.
struct FileMetadata {
    # The identifier for the file data.
    id @0 :Text;
    # The type of the file.
    type @1 :Text = "normal";
    # The output mode of the file.
    mode @2 :Text;
    # The timestamp representing the file's creation date.
    timestamp @3 :UInt32;
    # Additional metadata associated with the file.
    properties @4 :List(KeyValuePair);

    struct KeyValuePair {
        key @0 :Text;
        value @1 :Text;
    }
}

# Additional metadata associated with a file in the file system.
struct ChunkData {
    # The identifier for the file data.
    id @0 :Text;
    # An additional name for the file.
    name @1 :Text;
    # Files that are implicitly loaded after one of the specified files.
    implicitlyLoadedAfterOneOf @2 :List(Text);
    # The importer of the file.
    importer @3 :Text;
    # The signature preservation mode for the file.
    preserveSignature @4 :PreserveSignatureType;
}

# Additional metadata associated with a file in the file system.
struct PrebuiltData {
    # The identifier for the file data.
    id @0 :Text;
    # An additional name for the file.
    name @1 :Text;
    # The file exports.
    exports @2 :List(Text);
    # The source map for the file.
    map @3 :Text;
}

# Additional metadata associated with a file in the file system.
struct AssetData {
    # The identifier for the file data.
    id @0 :Text;
    # An additional name for the file.
    name @1 :Text;
    # Indicates whether the file needs a code reference.
    needsCodeReference @2 :Bool;
    # The original file name before any transformations.
    originalFileName @3 :Text;
}

# A mapping between a file path and its unique identifier.
# Note: Multiple paths can map to the same identifier (e.g., symlinks).
struct FileId {
    # An identifier for the file.
    id @0 :Text;
    # A virtual (or actual) path to the file in the file system.
    path @1 :Text;
}

# The content of a file in the file system.
struct FileData {
    # An identifier for the file.
    path @0 :Text;
    # A virtual (or actual) path to the file in the file system.
    code @1 :Text;
}

# A virtual representation of a file system containing multiple files.
struct FileSystem {
    ids @0 :List(FileId);
    files @1 :List(FileData);
    metadata @2 :List(FileMetadata);
    assets @3 :List(AssetData);
    chunks @4 :List(ChunkData);
    prebuilt @5 :List(PrebuiltData);
}
