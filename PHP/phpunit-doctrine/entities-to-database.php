<?php
/**
 * @note Inialize Entity Manager @see ./init-doctrine.php
 */
$em = \Doctrine\ORM\EntityManager::create(/* $connection, $ormConfig */);

/**
 * Step 2. Basic functionality :memory: database testing
 *
 * @author Viachaslau Lyskouski <s.lyskouski@creativity.by>
 */

// Get an instance of your entity manager
$entityManager = $em->getConnection();

// Clear Doctrine to be safe
$entityManager->clear();

// Schema Tool to process our entities
$tool = new \Doctrine\ORM\Tools\SchemaTool($entityManager);

/* @var $driver \Doctrine\ORM\Mapping\Driver\AnnotationDriver */
$driver = $entityManager->getConfiguration()->getMetadataDriverImpl();
$targetDriver = new AnnotationDriver($driver->getReader(), $entityPath);

$classes = $targetDriver->getAllClassNames();
$entities = array();
$factory = new \Doctrine\ORM\Mapping\ClassMetadataFactory();
$factory->setEntityManager($entityManager);
foreach ($classes as $class) {
    $metadata = $factory->getMetadataFor($class);
    $entities[] = $metadata;
}
// Drop all classes and re-build them for each test case
$tool->dropSchema($entities);
$tool->createSchema($entities);
