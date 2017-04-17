<?php
/**
 * Basic doctrine initialisation (for testing)
 *
 * @author Viachaslau Lyskouski <s.lyskouski@creativity.by>
 */
$devMode = true;
$connection = array(
    'url' => 'sqlite:///:memory:'
);
$entityPath = array('{path to entities}');
$proxyPath = '{path to proxies}';

$ormConfig = \Doctrine\ORM\Tools\Setup::createAnnotationMetadataConfiguration($entityPath, $devMode, $proxyPath, null, false);

// Create proxies
$ormConfig->setProxyDir($proxyPath);
$ormConfig->setProxyNamespace('{namespace for proxy classes}');
$ormConfig->setAutoGenerateProxyClasses($devMode);

// Inialize Entity Manager
$em = \Doctrine\ORM\EntityManager::create($connection, $ormConfig);
// $em->getConnection()->getConfiguration()->setSQLLogger('{logger class}');
// we treat the enums as strings
$platform = $em->getConnection()->getDatabasePlatform();
$platform->registerDoctrineTypeMapping('enum', 'string');
$platform->registerDoctrineTypeMapping('set', 'string');
// ...