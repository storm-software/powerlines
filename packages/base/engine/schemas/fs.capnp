@0xa56c61324b9d6e49;

# Additional metadata associated with a file in the file system.
struct FileMetadata {
    # The identifier for the file data.
    id @0 :Text;
    # The type of the file.
    type @1 :Text = "normal";
    # The timestamp representing the file's creation date.
    timestamp @2 :UInt32;
    # Additional metadata associated with the file.
    properties @3 :List(KeyValuePair);

    struct KeyValuePair {
        key @0 :Text;
        value @1 :Text;
    }
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
struct FileStorage {
    # An identifier for the file.
    path @0 :Text;
    # A virtual (or actual) path to the file in the file system.
    code @1 :Text;
}

# A virtual representation of a file system containing multiple files.
struct FileSystem {
    ids @0 :List(FileId);
    storage @1 :List(FileStorage);
    metadata @2 :List(FileMetadata);
}
