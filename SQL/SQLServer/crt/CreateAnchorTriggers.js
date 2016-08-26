/*~
-- ANCHOR TRIGGERS ---------------------------------------------------------------------------------------------------
--
-- The following triggers on the latest view make it behave like a table.
-- There are three different 'instead of' triggers: insert, update, and delete.
-- They will ensure that such operations are propagated to the underlying tables
-- in a consistent way. Default values are used for some columns if not provided
-- by the corresponding SQL statements.
--
-- For idempotent attributes, only changes that represent a value different from
-- the previous or following value are stored. Others are silently ignored in
-- order to avoid unnecessary temporal duplicates.
--
~*/
var anchor, knot, attribute;
while (anchor = schema.nextAnchor()) {
    if(anchor.hasMoreAttributes()) {
/*~
-- Insert trigger -----------------------------------------------------------------------------------------------------
-- it_l$anchor.name instead of INSERT trigger on l$anchor.name
-----------------------------------------------------------------------------------------------------------------------
CREATE TRIGGER [$anchor.capsule].[it_l$anchor.name] ON [$anchor.capsule].[l$anchor.name]
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @now $schema.metadata.chronon;
    SET @now = $schema.metadata.now;
    DECLARE @$anchor.mnemonic TABLE (
        Row bigint IDENTITY(1,1) not null primary key,
        $anchor.identityColumnName $anchor.identity not null
    );
    INSERT INTO [$anchor.capsule].[$anchor.name] (
        $(schema.METADATA)? $anchor.metadataColumnName : $anchor.dummyColumnName
    )
    OUTPUT
        inserted.$anchor.identityColumnName
    INTO
        @$anchor.mnemonic
    SELECT
        $(schema.METADATA)? $anchor.metadataColumnName : null
    FROM
        inserted
    WHERE
        inserted.$anchor.identityColumnName is null;
    DECLARE @inserted TABLE (
        $anchor.identityColumnName $anchor.identity not null,
        $(schema.METADATA)? $anchor.metadataColumnName $schema.metadata.metadataType not null,
~*/
        while (attribute = anchor.nextAttribute()) {
/*~
        $(schema.IMPROVED)? $attribute.anchorReferenceName $anchor.identity null,
        $(schema.METADATA)? $attribute.metadataColumnName $schema.metadata.metadataType null,
        $(attribute.isHistorized())? $attribute.changingColumnName $attribute.timeRange null,
        $attribute.positorColumnName $schema.metadata.positorRange null,
        $attribute.positingColumnName $schema.metadata.positingRange null,
        $attribute.reliabilityColumnName $schema.metadata.reliabilityRange null,
~*/
            if(attribute.isKnotted()) {
                knot = attribute.knot;
/*~
        $attribute.knotValueColumnName $knot.dataRange null,
        $(knot.hasChecksum())? $attribute.knotChecksumColumnName varbinary(16) null,
        $(schema.METADATA)? $attribute.knotMetadataColumnName $schema.metadata.metadataType null,
        $attribute.valueColumnName $knot.identity null$(anchor.hasMoreAttributes())?,
~*/
            }
            else {
/*~
        $attribute.valueColumnName $attribute.dataRange null$(anchor.hasMoreAttributes())?,
~*/
            }
        }
/*~
    );
    INSERT INTO @inserted
    SELECT
        ISNULL(i.$anchor.identityColumnName, a.$anchor.identityColumnName),
        $(schema.METADATA)? i.$anchor.metadataColumnName,
 ~*/
        while (attribute = anchor.nextAttribute()) {
/*~
        $(schema.IMPROVED)? ISNULL(ISNULL(i.$attribute.anchorReferenceName, i.$anchor.identityColumnName), a.$anchor.identityColumnName),
        $(schema.METADATA)? ISNULL(i.$attribute.metadataColumnName, i.$anchor.metadataColumnName),
        $(attribute.isHistorized())? ISNULL(i.$attribute.changingColumnName, @now),
        ISNULL(ISNULL(i.$attribute.positorColumnName, i.$schema.metadata.positorSuffix), 0),
        ISNULL(i.$attribute.positingColumnName, @now),
        ISNULL(ISNULL(i.$attribute.reliabilityColumnName, i.$schema.metadata.reliabilitySuffix), $schema.metadata.deleteReliability),
~*/
            if(attribute.isKnotted()) {
                knot = attribute.knot;
/*~
        i.$attribute.knotValueColumnName,
        $(knot.hasChecksum())? ISNULL(i.$attribute.knotChecksumColumnName, ${schema.metadata.encapsulation}$.MD5(cast(i.$attribute.knotValueColumnName as varbinary(max)))),
        $(schema.METADATA)? ISNULL(i.$attribute.knotMetadataColumnName, i.$anchor.metadataColumnName),
~*/
            }
/*~
        i.$attribute.valueColumnName$(anchor.hasMoreAttributes())?,
~*/
        }
/*~
    FROM (
        SELECT
            $schema.metadata.positorSuffix,
            $schema.metadata.reliabilitySuffix,
            $anchor.identityColumnName,
            $(schema.METADATA)? $anchor.metadataColumnName,
 ~*/
        while (attribute = anchor.nextAttribute()) {
/*~
            $(schema.IMPROVED)? $attribute.anchorReferenceName,
            $(schema.METADATA)? $attribute.metadataColumnName,
            $(attribute.isHistorized())? $attribute.changingColumnName,
            $attribute.positorColumnName,
            $attribute.positingColumnName,
            $attribute.reliabilityColumnName,
~*/
            if(attribute.isKnotted()) {
                knot = attribute.knot;
/*~
            $attribute.knotValueColumnName,
            $(knot.hasChecksum())? $attribute.knotChecksumColumnName,
            $(schema.METADATA)? $attribute.knotMetadataColumnName,
~*/
            }
/*~
            $attribute.valueColumnName,
~*/
        }
/*~
            ROW_NUMBER() OVER (PARTITION BY $anchor.identityColumnName ORDER BY $anchor.identityColumnName) AS Row
        FROM
            inserted
    ) i
    LEFT JOIN
        @$anchor.mnemonic a
    ON
        a.Row = i.Row;
~*/
        while (attribute = anchor.nextAttribute()) {
            knot = attribute.knot;
/*~
    INSERT INTO [$attribute.capsule].[$attribute.name] (
        $(schema.METADATA)? $attribute.metadataColumnName,
        $attribute.anchorReferenceName,
        $attribute.valueColumnName,
        $(attribute.timeRange)? $attribute.changingColumnName,
        $attribute.positingColumnName,
        $attribute.positorColumnName,
        $attribute.reliabilityColumnName
    )
    SELECT
        $(schema.METADATA)? i.$attribute.metadataColumnName,
        i.$attribute.anchorReferenceName,
        $(attribute.isKnotted())? ISNULL(i.$attribute.valueColumnName, [k$knot.mnemonic].$knot.identityColumnName), : i.$attribute.valueColumnName,
        $(attribute.timeRange)? i.$attribute.changingColumnName,
        i.$attribute.positingColumnName,
        i.$attribute.positorColumnName,
        i.$attribute.reliabilityColumnName
    FROM
        @inserted i
~*/
            if(attribute.isKnotted()) {
/*~
    LEFT JOIN
        [$knot.capsule].[$knot.name] [k$knot.mnemonic]
    ON
        $(knot.hasChecksum())? [k$knot.mnemonic].$knot.checksumColumnName = i.$attribute.knotChecksumColumnName : [k$knot.mnemonic].$knot.valueColumnName = i.$attribute.knotValueColumnName
    WHERE
        ISNULL(i.$attribute.valueColumnName, [k$knot.mnemonic].$knot.identityColumnName) is not null;
~*/
            }
            else {
/*~
    WHERE
        i.$attribute.valueColumnName is not null;
~*/
            }
        }
/*~
END
GO
~*/
	}
	if(anchor.hasMoreAttributes()) {
/*~
-- UPDATE trigger -----------------------------------------------------------------------------------------------------
-- ut_l$anchor.name instead of UPDATE trigger on l$anchor.name
-----------------------------------------------------------------------------------------------------------------------
CREATE TRIGGER [$anchor.capsule].[ut_l$anchor.name] ON [$anchor.capsule].[l$anchor.name]
INSTEAD OF UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @now $schema.metadata.chronon;
    SET @now = $schema.metadata.now;
    IF(UPDATE($anchor.identityColumnName))
        RAISERROR('The identity column $anchor.identityColumnName is not updatable.', 16, 1);
~*/
		while (attribute = anchor.nextAttribute()) {
/*~
    IF(UPDATE($attribute.identityColumnName))
        RAISERROR('The identity column $attribute.identityColumnName is not updatable.', 16, 1);
    IF(UPDATE($attribute.anchorReferenceName))
        RAISERROR('The foreign key column $attribute.anchorReferenceName is not updatable.', 16, 1);
    IF(UPDATE($attribute.assertionColumnName))
        RAISERROR('The computed assertion column $attribute.assertionColumnName is not updatable.', 16, 1);
~*/
			if(attribute.isKnotted()) {
				knot = attribute.knot;
                if(!attribute.isHistorized()) {
/*~
    IF (UPDATE($attribute.valueColumnName))
        RAISERROR('The static column $attribute.valueColumnName is not updatable, and only missing values have been added.', 0, 1);
    IF (UPDATE($attribute.knotValueColumnName))
        RAISERROR('The static column $attribute.knotValueColumnName is not updatable, and only missing values have been added.', 0, 1);
~*/
                }
/*~
    IF (
        $(attribute.isHistorized())? UPDATE($attribute.valueColumnName) OR
        $(attribute.isHistorized())? UPDATE($attribute.knotValueColumnName) OR
        UPDATE($attribute.reliabilityColumnName) OR
        UPDATE($schema.metadata.reliabilitySuffix)
    )
    BEGIN
        INSERT INTO [$attribute.capsule].[$attribute.name] (
            $(schema.METADATA)? $attribute.metadataColumnName,
            $attribute.anchorReferenceName,
            $attribute.valueColumnName,
            $(attribute.isHistorized())? $attribute.changingColumnName,
            $attribute.positingColumnName,
            $attribute.positorColumnName,
            $attribute.reliabilityColumnName
        )
        SELECT
~*/
                if(schema.METADATA) {
/*~
            ISNULL(CASE
                WHEN UPDATE($anchor.metadataColumnName) AND NOT UPDATE($attribute.metadataColumnName)
                THEN i.$anchor.metadataColumnName
                ELSE i.$attribute.metadataColumnName
            END, i.$anchor.metadataColumnName),
~*/
                }
/*~
            ISNULL(i.$attribute.anchorReferenceName, i.$anchor.identityColumnName),
            ISNULL(i.$attribute.valueColumnName, [k$knot.mnemonic].$knot.identityColumnName),
~*/
                if(attribute.isHistorized()) {
/*~
            cast(ISNULL(CASE
                WHEN UPDATE($schema.metadata.reliabilitySuffix) AND NOT UPDATE($attribute.changingColumnName) THEN i.$attribute.changingColumnName
                WHEN UPDATE($attribute.changingColumnName) THEN i.$attribute.changingColumnName
            END, @now) as $attribute.timeRange),
~*/
                }
/*~
            cast(ISNULL(CASE
                WHEN UPDATE($attribute.positingColumnName) THEN i.$attribute.positingColumnName
            END, @now) as $schema.metadata.positingRange),
            ISNULL(CASE
                WHEN UPDATE($schema.metadata.positorSuffix) THEN i.$schema.metadata.positorSuffix
                ELSE i.$attribute.positorColumnName
            END, 0),
            ISNULL(CASE
                WHEN UPDATE($attribute.reliabilityColumnName) THEN i.$attribute.reliabilityColumnName
                WHEN UPDATE($schema.metadata.reliabilitySuffix) THEN $schema.metadata.reliabilitySuffix
                ELSE i.$attribute.reliabilityColumnName
            END, $schema.metadata.deleteReliability)
        FROM
            inserted i
        LEFT JOIN
            [$knot.capsule].[$knot.name] [k$knot.mnemonic]
        ON
            $(knot.hasChecksum())? [k$knot.mnemonic].$knot.checksumColumnName = ${schema.metadata.encapsulation}$.MD5(cast(i.$attribute.knotValueColumnName as varbinary(max))) : [k$knot.mnemonic].$knot.valueColumnName = i.$attribute.knotValueColumnName
        WHERE
            ISNULL(i.$attribute.valueColumnName, [k$knot.mnemonic].$knot.identityColumnName) is not null
    END
~*/
            }
			else { // not knotted
                if(!attribute.isHistorized()) {
/*~
    IF (UPDATE($attribute.valueColumnName))
        RAISERROR('The static column $attribute.valueColumnName is not updatable, and only missing values have been added.', 0, 1);
~*/
                }
/*~
    IF (
        $(attribute.isHistorized())? UPDATE($attribute.valueColumnName) OR
        UPDATE($attribute.reliabilityColumnName) OR
        UPDATE($schema.metadata.reliabilitySuffix)
    )
    BEGIN
        INSERT INTO [$attribute.capsule].[$attribute.name] (
            $(schema.METADATA)? $attribute.metadataColumnName,
            $attribute.anchorReferenceName,
            $attribute.valueColumnName,
            $(attribute.isHistorized())? $attribute.changingColumnName,
            $attribute.positingColumnName,
            $attribute.positorColumnName,
            $attribute.reliabilityColumnName
        )
        SELECT
~*/
                if(schema.METADATA) {
/*~
            ISNULL(CASE
                WHEN UPDATE($anchor.metadataColumnName) AND NOT UPDATE($attribute.metadataColumnName)
                THEN i.$anchor.metadataColumnName
                ELSE i.$attribute.metadataColumnName
            END, i.$anchor.metadataColumnName),
~*/
                }
/*~
            ISNULL(i.$attribute.anchorReferenceName, i.$anchor.identityColumnName),
            i.$attribute.valueColumnName,
~*/
                if(attribute.isHistorized()) {
/*~
            cast(ISNULL(CASE
                WHEN UPDATE($schema.metadata.reliabilitySuffix) AND NOT UPDATE($attribute.changingColumnName) THEN i.$attribute.changingColumnName
                WHEN UPDATE($attribute.changingColumnName) THEN i.$attribute.changingColumnName
            END, @now) as $attribute.timeRange),
~*/
                }
/*~
            cast(ISNULL(CASE
                WHEN UPDATE($attribute.positingColumnName) THEN i.$attribute.positingColumnName
            END, @now) as $schema.metadata.positingRange),
            ISNULL(CASE
                WHEN UPDATE($schema.metadata.positorSuffix) THEN i.$schema.metadata.positorSuffix
                ELSE i.$attribute.positorColumnName
            END, 0),
            ISNULL(CASE
                WHEN UPDATE($attribute.reliabilityColumnName) THEN i.$attribute.reliabilityColumnName
                WHEN UPDATE($schema.metadata.reliabilitySuffix) THEN $schema.metadata.reliabilitySuffix
                ELSE i.$attribute.reliabilityColumnName
            END, $schema.metadata.deleteReliability)
        FROM
            inserted i
        WHERE
            i.$attribute.valueColumnName is not null
    END
~*/
			} // end of not knotted
        } // end of while loop over attributes
/*~
END
GO
~*/
	} // end of if attributes exist
	if(anchor.hasMoreAttributes()) {
/*~
-- DELETE trigger -----------------------------------------------------------------------------------------------------
-- dt_l$anchor.name instead of DELETE trigger on l$anchor.name
-----------------------------------------------------------------------------------------------------------------------
CREATE TRIGGER [$anchor.capsule].[dt_l$anchor.name] ON [$anchor.capsule].[l$anchor.name]
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @now $schema.metadata.chronon;
    SET @now = $schema.metadata.now;
~*/
        while (attribute = anchor.nextAttribute()) {
/*~
    INSERT INTO [$attribute.capsule].[$attribute.annexName] (
        $(schema.METADATA)? $attribute.metadataColumnName,
        $attribute.identityColumnName,
        $attribute.positorColumnName,
        $attribute.positingColumnName,
        $attribute.reliabilityColumnName
    )
    SELECT
        $(schema.METADATA)? p.$attribute.metadataColumnName,
        p.$attribute.identityColumnName,
        p.$attribute.positorColumnName,
        @now,
        $schema.metadata.deleteReliability
    FROM
        deleted d
    JOIN
        [$attribute.capsule].[$attribute.annexName] p
    ON
        p.$attribute.identityColumnName = d.$attribute.identityColumnName;
~*/
        }
/*~
END
GO
~*/
	}
}
